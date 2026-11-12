package pro.budget.app.voice;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;
/** 16 kHz mono 16-bit PCM input only. No storage, Android, networking or microphone APIs. */
public final class LocalWhisperPcm {
    public static final int MAX_WAV = 960044;
    public static final int MAX_SAMPLES = (MAX_WAV - 44) / 2;
    private LocalWhisperPcm() {}
    public static byte[] pcm(byte[] wav) {
        if (wav == null || wav.length < 7084 || wav.length > MAX_WAV) throw new IllegalArgumentException("WHISPER_INVALID_WAV");
        ByteBuffer b = ByteBuffer.wrap(wav).order(ByteOrder.LITTLE_ENDIAN);
        if (b.getInt(0) != 0x46464952 || b.getInt(8) != 0x45564157 || b.getInt(12) != 0x20746d66 || b.getInt(36) != 0x61746164 || b.getInt(4) != wav.length - 8 || b.getInt(16) != 16 || b.getShort(20) != 1 || b.getShort(22) != 1 || b.getInt(24) != 16000 || b.getInt(28) != 32000 || b.getShort(32) != 2 || b.getShort(34) != 16 || b.getInt(40) != wav.length - 44 || (wav.length - 44) % 2 != 0) throw new IllegalArgumentException("WHISPER_INVALID_WAV");
        return Arrays.copyOfRange(wav, 44, wav.length);
    }
    /** whisper.cpp consumes normalised float samples in [-1, 1). */
    public static float[] floats(byte[] pcm) {
        if (pcm == null || pcm.length == 0 || (pcm.length & 1) != 0) throw new IllegalArgumentException("WHISPER_INVALID_WAV");
        float[] samples = new float[pcm.length / 2];
        for (int i = 0; i < samples.length; i++) samples[i] = (short) ((pcm[2 * i] & 0xff) | (pcm[2 * i + 1] << 8)) / 32768f;
        return samples;
    }
}
