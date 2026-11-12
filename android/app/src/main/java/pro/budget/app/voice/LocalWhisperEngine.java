package pro.budget.app.voice;
import java.util.Arrays;
/** Serial-worker lifecycle with an injectable native boundary, so JVM tests cover the Java half. */
public final class LocalWhisperEngine implements AutoCloseable {
    public interface Cancellation { boolean getAsBoolean(); }
    /** Confirmed transcript plus the diagnostics of the same run. */
    public static final class Result {
        public final String text;
        public final String language;
        public final int segments;
        public final float noSpeechProb;
        public Result(String text, String language, int segments, float noSpeechProb) {
            this.text = text == null ? "" : text;
            this.language = language == null ? "und" : language;
            this.segments = segments;
            this.noSpeechProb = noSpeechProb;
        }
    }
    public interface Model extends AutoCloseable {
        Result transcribe(float[] pcm, String language, Cancellation cancelled) throws Exception;
        /** Best-effort abort of a run in progress; safe to call when idle. */
        void cancel();
        void close();
    }
    public interface Factory { Model open() throws Exception; }
    private final Factory factory;
    private volatile Model model;
    public LocalWhisperEngine(Factory factory) { this.factory = factory; }
    public boolean initialize() throws Exception {
        if (model != null) return false;
        model = factory.open();
        if (model == null) throw new IllegalStateException("WHISPER_MODEL_FAILED");
        return true;
    }
    public Result transcribe(float[] pcm, String language, Cancellation cancelled) throws Exception {
        final Model active = model;
        if (active == null) throw new IllegalStateException("WHISPER_NOT_READY");
        if (pcm == null || pcm.length == 0 || pcm.length > LocalWhisperPcm.MAX_SAMPLES) throw new IllegalArgumentException("WHISPER_INVALID_WAV");
        final Cancellation check = cancelled == null ? () -> false : cancelled;
        try {
            if (check.getAsBoolean()) throw new InterruptedException("WHISPER_CANCELLED");
            Result result = active.transcribe(pcm, language, check);
            if (check.getAsBoolean()) throw new InterruptedException("WHISPER_CANCELLED");
            return result;
        } finally { Arrays.fill(pcm, 0f); }
    }
    public void cancel() { final Model active = model; if (active != null) active.cancel(); }
    @Override public void close() {
        final Model active = model;
        model = null;
        if (active != null) active.close();
    }
}
