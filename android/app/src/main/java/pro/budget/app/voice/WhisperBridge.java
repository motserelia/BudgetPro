package pro.budget.app.voice;
/** Thin JNI boundary: no logging, no storage, no network. */
public final class WhisperBridge {
    public static final String LIBRARY = "budgetpro_whisper";
    private static final boolean AVAILABLE;
    static {
        boolean loaded;
        try { System.loadLibrary(LIBRARY); loaded = true; } catch (Throwable ignored) { loaded = false; }
        AVAILABLE = loaded;
    }
    private WhisperBridge() {}
    static boolean available() { return AVAILABLE; }
    static native String nativeBuild();
    static native long nativeInit(String modelPath);
    static native String nativeTranscribe(long context, float[] samples, String language, int threads, float noSpeechThold);
    static native String nativeDetectedLanguage(long context);
    static native int nativeSegments(long context);
    static native float nativeNoSpeechProb(long context);
    static native void nativeCancel(long context);
    static native void nativeFree(long context);
}
