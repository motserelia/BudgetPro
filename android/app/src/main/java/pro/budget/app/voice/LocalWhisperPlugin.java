package pro.budget.app.voice;
import android.content.*;
import android.os.*;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Arrays;
import java.util.concurrent.*;
/** App-private offline Capacitor facade. No microphone permission request or cloud code. */
@CapacitorPlugin(name = "BudgetPROWhisper")
public final class LocalWhisperPlugin extends Plugin {
    private static final int TIMEOUT_MS = 120000;
    private static final int MAX_BASE64 = 1280060;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private volatile Messenger service;
    private boolean bound;
    private volatile PluginCall pending;
    private int sequence;
    private Runnable connected, timeout;
    private final Messenger replies = new Messenger(new Handler(Looper.getMainLooper(), m -> {
        Bundle b = m.getData();
        if (pending == null || b.getInt("id") != sequence) return true;
        PluginCall call = pending;
        pending = null;
        main.removeCallbacks(timeout);
        if (b.getString("error") != null) call.reject(b.getString("error"), b.getString("error"));
        else try { call.resolve(new JSObject(b.getString("json"))); } catch (Exception e) { call.reject("WHISPER_BAD_RESPONSE", "WHISPER_BAD_RESPONSE"); }
        return true;
    }));
    private final ServiceConnection connection = new ServiceConnection() {
        public void onServiceConnected(ComponentName n, IBinder binder) { service = new Messenger(binder); Runnable r = connected; connected = null; if (r != null) r.run(); }
        public void onServiceDisconnected(ComponentName n) { service = null; reject("WHISPER_PROCESS_STOPPED"); }
        public void onBindingDied(ComponentName n) { service = null; reject("WHISPER_PROCESS_STOPPED"); disconnect(); }
        public void onNullBinding(ComponentName n) { reject("WHISPER_DEBUG_ONLY"); disconnect(); }
    };
    private void reject(String code) {
        connected = null;
        if (pending != null) {
            PluginCall call = pending;
            pending = null;
            if (timeout != null) main.removeCallbacks(timeout);
            call.reject(code, code);
        }
    }
    private void disconnect() {
        connected = null;
        if (bound) try { getContext().unbindService(connection); } catch (Exception ignored) {}
        bound = false;
        service = null;
    }
    private void signal(int action) {
        if (service != null) try {
            Message m = Message.obtain(null, action);
            m.replyTo = replies;
            m.setData(new Bundle());
            service.send(m);
        } catch (Exception ignored) {}
    }
    private void request(PluginCall call, int action) {
        main.post(() -> {
            if (pending != null) { call.reject("WHISPER_BUSY", "WHISPER_BUSY"); return; }
            String language = call.getString("language");
            if ((action == LocalWhisperService.INIT || action == LocalWhisperService.TRANSCRIBE) && !LocalWhisperService.supportsLanguage(language)) {
                call.reject("WHISPER_LANGUAGE_REQUIRED", "WHISPER_LANGUAGE_REQUIRED");
                return;
            }
            final String encoded = action == LocalWhisperService.TRANSCRIBE ? call.getString("wavBase64") : null;
            if (action == LocalWhisperService.TRANSCRIBE && (encoded == null || encoded.length() > MAX_BASE64)) {
                call.reject("WHISPER_INVALID_WAV", "WHISPER_INVALID_WAV");
                return;
            }
            pending = call;
            final int id = ++sequence;
            timeout = () -> {
                reject("WHISPER_TIMEOUT");
                signal(LocalWhisperService.CANCEL);
                signal(LocalWhisperService.RELEASE);
                disconnect();
            };
            main.postDelayed(timeout, TIMEOUT_MS);
            Runnable send = () -> io.execute(() -> {
                if (pending != call) return;
                byte[] wav = null;
                ParcelFileDescriptor[] pipe = null;
                try {
                    if (encoded != null) {
                        wav = android.util.Base64.decode(encoded, android.util.Base64.NO_WRAP);
                        byte[] pcm = LocalWhisperPcm.pcm(wav);   // validate the WAV header before the bytes leave this process
                        Arrays.fill(pcm, (byte) 0);
                        pipe = ParcelFileDescriptor.createPipe();
                    }
                    Message m = Message.obtain(null, action);
                    Bundle b = new Bundle();
                    b.putInt("id", id);
                    b.putString("language", language);
                    if (pipe != null) b.putParcelable("audio", pipe[0]);
                    m.setData(b);
                    m.replyTo = replies;
                    if (pending != call) return;
                    Messenger target = service;
                    if (target == null) throw new IllegalStateException();
                    target.send(m);
                    if (pipe != null) {
                        pipe[0].close();
                        try (java.io.OutputStream out = new ParcelFileDescriptor.AutoCloseOutputStream(pipe[1])) { out.write(wav); }
                    }
                } catch (Exception | OutOfMemoryError e) {
                    main.post(() -> { if (sequence == id) reject(e instanceof OutOfMemoryError ? "WHISPER_LOW_MEMORY" : "WHISPER_INPUT_OR_SERVICE_ERROR"); });
                } finally {
                    if (wav != null) Arrays.fill(wav, (byte) 0);
                    if (pipe != null) for (ParcelFileDescriptor fd : pipe) try { fd.close(); } catch (Exception ignored) {}
                }
            });
            if (service != null) send.run();
            else {
                connected = send;
                if (!bound) {
                    bound = getContext().bindService(new Intent(getContext(), LocalWhisperService.class), connection, Context.BIND_AUTO_CREATE);
                    if (!bound) reject("WHISPER_BIND_FAILED");
                }
            }
        });
    }
    @PluginMethod public void initialize(PluginCall call) { request(call, LocalWhisperService.INIT); }
    @PluginMethod public void transcribe(PluginCall call) { request(call, LocalWhisperService.TRANSCRIBE); }
    @PluginMethod public void release(PluginCall call) { request(call, LocalWhisperService.RELEASE); }
    @PluginMethod public void cancel(PluginCall call) {
        main.post(() -> {
            reject("WHISPER_CANCELLED");
            signal(LocalWhisperService.CANCEL);
            signal(LocalWhisperService.RELEASE);
            call.resolve(new JSObject().put("cancelled", true));
        });
    }
    @Override protected void handleOnPause() {
        main.post(() -> {
            if (pending != null) { reject("WHISPER_CANCELLED"); signal(LocalWhisperService.CANCEL); }
            signal(LocalWhisperService.RELEASE);
        });
    }
    @Override protected void handleOnDestroy() {
        main.post(() -> {
            reject("WHISPER_CANCELLED");
            signal(LocalWhisperService.CANCEL);
            signal(LocalWhisperService.RELEASE);
            disconnect();
        });
        io.shutdownNow();
    }
}
