package pro.budget.app.voice;
import java.util.Arrays;
/** Serial-worker lifecycle with injectable native boundary for JVM regression tests. */
public final class LocalVoskEngine implements AutoCloseable {
    /**
     * Trailing silence after the spoken audio. Vosk keeps the last words in its lookahead,
     * so Stop pressed right after speech would otherwise lose them in the final result.
     */
    public static final int TAIL_SILENCE_BYTES = 19200; // 0.6 s of 16 kHz 16-bit PCM
    public interface Cancellation { boolean getAsBoolean(); }
    public interface Decoder extends AutoCloseable { void accept(byte[] pcm,int length) throws Exception; String finish() throws Exception; void close(); }
    public interface Backend extends AutoCloseable { Decoder decoder() throws Exception; void close(); }
    public interface Factory { Backend open() throws Exception; }
    private final Factory factory;
    private Backend backend;
    public LocalVoskEngine(Factory factory) { this.factory=factory; }
    public boolean initialize() throws Exception { if(backend!=null)return false; backend=factory.open(); if(backend==null)throw new IllegalStateException("VOSK_MODEL_FAILED"); return true; }
    public String recognize(byte[] pcm,Cancellation cancelled) throws Exception {
        if(backend==null)throw new IllegalStateException("VOSK_NOT_READY");
        try(Decoder d=backend.decoder()) {
            for(int p=0;p<pcm.length;p+=8000) {
                if(cancelled.getAsBoolean())throw new InterruptedException("VOSK_CANCELLED");
                byte[] chunk=Arrays.copyOfRange(pcm,p,Math.min(p+8000,pcm.length));
                try { d.accept(chunk,chunk.length); } finally { Arrays.fill(chunk,(byte)0); }
            }
            if(cancelled.getAsBoolean())throw new InterruptedException("VOSK_CANCELLED");
            // Flush the decoder lookahead with a bounded silence tail before the final result.
            byte[] tail=new byte[TAIL_SILENCE_BYTES];
            try { d.accept(tail,tail.length); } finally { Arrays.fill(tail,(byte)0); }
            if(cancelled.getAsBoolean())throw new InterruptedException("VOSK_CANCELLED");
            return d.finish();
        } finally { Arrays.fill(pcm,(byte)0); }
    }
    public void close(){ if(backend!=null){try{backend.close();}finally{backend=null;}} }
}
