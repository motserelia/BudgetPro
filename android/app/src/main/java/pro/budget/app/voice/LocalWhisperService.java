package pro.budget.app.voice;
import android.app.ActivityManager;
import android.app.Service;
import android.content.Intent;
import android.os.*;
import org.json.*;
import java.io.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
/** Non-exported separate process. Only the bundled model file is written; audio stays in a pipe. */
public final class LocalWhisperService extends Service {
    static final int INIT = 1, TRANSCRIBE = 2, RELEASE = 3, CANCEL = 4;
    /** One multilingual model serves ru, en and ka; the language is chosen per request. */
    static final String MODEL = "ggml-small-q5_1";
    /** Model weights plus compute buffers need roughly 230 MB, so refuse to start below this. */
    private static final long MIN_AVAIL_BYTES = 640L * 1024 * 1024;
    private static final int THREADS_LIMIT = 4;
    private static final float NO_SPEECH_THOLD = 0.6f;
    private static final Set<String> LANGUAGES = Collections.unmodifiableSet(new LinkedHashSet<>(Arrays.asList("ru", "en", "ka", "auto")));
    static boolean supportsLanguage(String language) {
        return language != null && LANGUAGES.contains(language.trim().toLowerCase(Locale.ROOT));
    }
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final AtomicInteger generation = new AtomicInteger();
    private volatile LocalWhisperEngine engine;
    private String activeModel;
    private final Messenger inbox = new Messenger(new Handler(Looper.getMainLooper(), m -> {
        if (m.what == CANCEL) { generation.incrementAndGet(); cancelRunning(); return true; }
        final int g = generation.get();
        final Bundle args = m.getData();
        final Messenger reply = m.replyTo;
        final int action = m.what;
        worker.execute(() -> run(action, args, reply, g));
        return true;
    }));
    @Override public IBinder onBind(Intent intent) { return inbox.getBinder(); }
    private void cancelRunning() { final LocalWhisperEngine active = engine; if (active != null) active.cancel(); }
    private void resources() throws Exception {
        ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
        getSystemService(ActivityManager.class).getMemoryInfo(mi);
        if (mi.lowMemory || mi.availMem < MIN_AVAIL_BYTES) throw new IOException("WHISPER_LOW_MEMORY");
    }
    private static int threads() {
        return Math.max(1, Math.min(THREADS_LIMIT, Runtime.getRuntime().availableProcessors()));
    }
    /** The manifest lists only the model packaged in this APK, so a missing entry is an error, not a substitution. */
    private File modelFile() throws Exception {
        final JSONObject manifest;
        try (InputStream in = getAssets().open("whisper-models-manifest.json")) {
            manifest = new JSONObject(new String(readBounded(in, 100000), java.nio.charset.StandardCharsets.UTF_8)).optJSONObject(MODEL);
        }
        if (manifest == null) throw new FileNotFoundException("WHISPER_MODEL_NOT_FOUND");
        if (!MODEL.equals(manifest.optString("model"))) throw new IOException("WHISPER_MODEL_INTEGRITY");
        final JSONArray files = manifest.getJSONArray("files");
        if (files.length() != 1) throw new IOException("WHISPER_MODEL_INTEGRITY");
        final JSONObject item = files.getJSONObject(0);
        final String name = item.getString("path");
        if (name.isEmpty() || name.contains("..") || name.startsWith("/")) throw new IOException("WHISPER_MODEL_INTEGRITY");
        final File directory = new File(getNoBackupFilesDir(), MODEL);
        final File out = new File(directory, name);
        final String expected = item.getString("sha256");
        if (out.isFile() && digest(out).equals(expected)) return out;
        if (new StatFs(getNoBackupFilesDir().getAbsolutePath()).getAvailableBytes() < item.getLong("bytes") + 50L * 1024 * 1024) throw new IOException("WHISPER_STORAGE_LOW");
        if (!directory.isDirectory() && !directory.mkdirs()) throw new IOException("WHISPER_MODEL_FAILED");
        final File part = new File(out.getPath() + ".part");
        try (InputStream in = getAssets().open(MODEL + "/" + name); OutputStream os = new FileOutputStream(part)) {
            byte[] buf = new byte[65536];
            int n;
            while ((n = in.read(buf)) != -1) os.write(buf, 0, n);
        }
        if (!digest(part).equals(expected)) { part.delete(); throw new IOException("WHISPER_MODEL_INTEGRITY"); }
        if (!part.renameTo(out)) { part.delete(); throw new IOException("WHISPER_MODEL_FAILED"); }
        return out;
    }
    private static String digest(File f) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        try (InputStream in = new FileInputStream(f)) {
            byte[] b = new byte[32768];
            int n;
            while ((n = in.read(b)) != -1) md.update(b, 0, n);
        }
        StringBuilder s = new StringBuilder();
        for (byte b : md.digest()) s.append(String.format(Locale.ROOT, "%02x", b & 255));
        return s.toString();
    }
    static byte[] readBounded(InputStream in, int limit) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] b = new byte[8192];
        int n, total = 0;
        while ((n = in.read(b)) != -1) {
            total += n;
            if (total > limit) throw new IOException("WHISPER_INVALID_WAV");
            out.write(b, 0, n);
        }
        return out.toByteArray();
    }
    private void initialize() throws Exception {
        if (engine != null) return;
        if (!WhisperBridge.available()) throw new LinkageError("WHISPER_NATIVE_UNAVAILABLE");
        final File file = modelFile();
        final LocalWhisperEngine created = new LocalWhisperEngine(() -> {
            final long context = WhisperBridge.nativeInit(file.getAbsolutePath());
            if (context == 0) throw new IOException("WHISPER_MODEL_LOAD_FAILED");
            return new LocalWhisperEngine.Model() {
                public LocalWhisperEngine.Result transcribe(float[] pcm, String language, LocalWhisperEngine.Cancellation cancelled) throws Exception {
                    final String text = WhisperBridge.nativeTranscribe(context, pcm, language, threads(), NO_SPEECH_THOLD);
                    if (text == null) throw new IllegalStateException("WHISPER_INFERENCE_FAILED");
                    return new LocalWhisperEngine.Result(text, WhisperBridge.nativeDetectedLanguage(context), WhisperBridge.nativeSegments(context), WhisperBridge.nativeNoSpeechProb(context));
                }
                public void cancel() { WhisperBridge.nativeCancel(context); }
                public void close() { WhisperBridge.nativeFree(context); }
            };
        });
        created.initialize();
        engine = created;
        activeModel = MODEL;
    }
    private static long peakRssKiB() {
        try (BufferedReader r = new BufferedReader(new FileReader("/proc/self/status"))) {
            String s;
            while ((s = r.readLine()) != null) if (s.startsWith("VmHWM:")) return Long.parseLong(s.replaceAll("[^0-9]", ""));
        } catch (Exception ignored) {}
        return -1;
    }
    private void run(int action, Bundle args, Messenger reply, int g) {
        final JSONObject result = new JSONObject();
        byte[] wav = null;
        float[] pcm = null;
        boolean cancelled = false;
        try {
            final long wall = SystemClock.elapsedRealtimeNanos(), cpu = android.os.Process.getElapsedCpuTime();
            if (action == RELEASE) {
                if (engine != null) engine.close();
                engine = null;
                activeModel = null;
                result.put("released", true);
            } else {
                resources();
                final long init = SystemClock.elapsedRealtimeNanos();
                initialize();
                result.put("initializationMs", (SystemClock.elapsedRealtimeNanos() - init) / 1e6);
                if (action == TRANSCRIBE) {
                    final ParcelFileDescriptor fd = args.getParcelable("audio");
                    if (fd == null) throw new IOException("WHISPER_INVALID_WAV");
                    try (InputStream in = new ParcelFileDescriptor.AutoCloseInputStream(fd)) { wav = readBounded(in, LocalWhisperPcm.MAX_WAV); }
                    pcm = LocalWhisperPcm.floats(LocalWhisperPcm.pcm(wav));
                    final long start = SystemClock.elapsedRealtimeNanos(), c = android.os.Process.getElapsedCpuTime();
                    final LocalWhisperEngine.Result recognized = engine.transcribe(pcm, args.getString("language"), () -> generation.get() != g || Thread.currentThread().isInterrupted());
                    result.put("transcript", recognized.text);
                    result.put("detectedLanguage", recognized.language);
                    result.put("segments", recognized.segments);
                    result.put("noSpeechProb", recognized.noSpeechProb);
                    result.put("recognitionMs", (SystemClock.elapsedRealtimeNanos() - start) / 1e6);
                    result.put("recognitionCpuMs", android.os.Process.getElapsedCpuTime() - c);
                    result.put("audioBytes", wav.length);
                    result.put("samples", pcm.length);
                    result.put("inferenceThreads", threads());
                } else if (action != INIT) throw new IOException("WHISPER_BAD_ACTION");
            }
            if (generation.get() != g) throw new InterruptedException("WHISPER_CANCELLED");
            result.put("elapsedMs", (SystemClock.elapsedRealtimeNanos() - wall) / 1e6);
            result.put("cpuMs", android.os.Process.getElapsedCpuTime() - cpu);
            result.put("pssKiB", Debug.getPss());
            result.put("peakRssKiB", peakRssKiB());
            result.put("model", activeModel);
            result.put("engine", "whisper.cpp");
            result.put("offline", true);
            send(reply, args.getInt("id"), result.toString(), null);
        } catch (Exception | OutOfMemoryError | LinkageError error) {
            cancelled = error instanceof InterruptedException;
            if (!cancelled && engine != null) {
                try { engine.close(); } catch (Throwable ignored) {}
                engine = null;
                activeModel = null;
            }
            String code;
            if (error instanceof OutOfMemoryError) code = "WHISPER_LOW_MEMORY";
            else if (error instanceof LinkageError) code = "WHISPER_NATIVE_UNAVAILABLE";
            else if (cancelled) code = "WHISPER_CANCELLED";
            else if (error instanceof java.io.FileNotFoundException) code = "WHISPER_MODEL_NOT_FOUND";
            else code = error.getMessage();
            if (code == null || !code.matches("WHISPER_[A-Z_]+")) code = "WHISPER_RECOGNIZER_FAILED";
            send(reply, args.getInt("id"), null, code);
        } finally {
            if (wav != null) Arrays.fill(wav, (byte) 0);
            if (pcm != null) Arrays.fill(pcm, 0f);
            final ParcelFileDescriptor fd = args.getParcelable("audio");
            if (fd != null) try { fd.close(); } catch (IOException ignored) {}
        }
    }
    private void send(Messenger reply, int id, String json, String error) {
        try {
            Message m = Message.obtain();
            Bundle b = new Bundle();
            b.putInt("id", id);
            b.putString("json", json);
            b.putString("error", error);
            m.setData(b);
            reply.send(m);
        } catch (Exception ignored) {}
    }
    @Override public void onDestroy() {
        generation.incrementAndGet();
        worker.execute(() -> {
            final LocalWhisperEngine active = engine;
            engine = null;
            activeModel = null;
            if (active != null) active.close();
        });
        worker.shutdown();
        super.onDestroy();
    }
}

