package pro.budget.app.voice;
import org.junit.Test;
import static org.junit.Assert.*;
import java.nio.*;
import java.util.concurrent.atomic.AtomicInteger;
public class LocalVoskCoreTest {
 private byte[] wav(){byte[] w=new byte[32044];ByteBuffer b=ByteBuffer.wrap(w).order(ByteOrder.LITTLE_ENDIAN);b.putInt(0,0x46464952);b.putInt(4,w.length-8);b.putInt(8,0x45564157);b.putInt(12,0x20746d66);b.putInt(16,16);b.putShort(20,(short)1);b.putShort(22,(short)1);b.putInt(24,16000);b.putInt(28,32000);b.putShort(32,(short)2);b.putShort(34,(short)16);b.putInt(36,0x61746164);b.putInt(40,w.length-44);return w;}
 @Test public void pcmFormatAndBounds(){assertEquals(32000,LocalVoskPcm.pcm(wav()).length);for(int offset:new int[]{0,4,8,12,16,20,22,24,28,32,34,36,40}){byte[] w=wav();w[offset]^=1;assertThrows(IllegalArgumentException.class,()->LocalVoskPcm.pcm(w));}assertThrows(IllegalArgumentException.class,()->LocalVoskPcm.pcm(new byte[10]));assertThrows(IllegalArgumentException.class,()->LocalVoskPcm.pcm(new byte[960046]));}
 private final AtomicInteger models=new AtomicInteger(),closed=new AtomicInteger(),decoders=new AtomicInteger(),freed=new AtomicInteger(),bytes=new AtomicInteger();
 private LocalVoskEngine engine(boolean fail){return new LocalVoskEngine(()->{models.incrementAndGet();return new LocalVoskEngine.Backend(){public LocalVoskEngine.Decoder decoder(){decoders.incrementAndGet();return new LocalVoskEngine.Decoder(){public void accept(byte[] p,int n)throws Exception{bytes.addAndGet(n);if(fail)throw new Exception("mock native failure");}public String finish(){return "რვა ლარი";}public void close(){freed.incrementAndGet();}};}public void close(){closed.incrementAndGet();}};});}
 @Test public void warmReuseReleaseAndReinitialize()throws Exception{LocalVoskEngine e=engine(false);assertTrue(e.initialize());assertFalse(e.initialize());assertEquals("რვა ლარი",e.recognize(new byte[32000],()->false));assertEquals("რვა ლარი",e.recognize(new byte[32000],()->false));assertEquals(1,models.get());assertEquals(2,freed.get());assertEquals(2*(32000+LocalVoskEngine.TAIL_SILENCE_BYTES),bytes.get());e.close();e.close();assertEquals(1,closed.get());assertTrue(e.initialize());e.close();assertEquals(2,closed.get());}
 @Test public void trailingSilenceFlushesLastWordsBeforeFinalResult()throws Exception{
  final java.util.List<byte[]> accepted=new java.util.ArrayList<>();final AtomicInteger finished=new AtomicInteger();
  LocalVoskEngine e=new LocalVoskEngine(()->new LocalVoskEngine.Backend(){public LocalVoskEngine.Decoder decoder(){return new LocalVoskEngine.Decoder(){public void accept(byte[] p,int n){accepted.add(java.util.Arrays.copyOf(p,n));}public String finish(){finished.incrementAndGet();return "რვა ლარი";}public void close(){}};}public void close(){}});
  e.initialize();assertEquals("რვა ლარი",e.recognize(new byte[16000],()->false));
  assertEquals(1,finished.get());assertEquals(3,accepted.size());
  byte[] tail=accepted.get(accepted.size()-1);assertEquals(LocalVoskEngine.TAIL_SILENCE_BYTES,tail.length);
  for(byte b:tail)assertEquals(0,b);
  assertEquals(8000,accepted.get(0).length);assertEquals(8000,accepted.get(1).length);
  e.close();
 }
 @Test public void decodeErrorReleasesAndZeroes()throws Exception{LocalVoskEngine e=engine(true);e.initialize();byte[] p=new byte[16000];java.util.Arrays.fill(p,(byte)7);assertThrows(Exception.class,()->e.recognize(p,()->false));assertEquals(1,freed.get());for(byte b:p)assertEquals(0,b);e.close();assertEquals(1,closed.get());}
 @Test public void cancellationReleasesDecoder()throws Exception{LocalVoskEngine e=engine(false);e.initialize();assertThrows(InterruptedException.class,()->e.recognize(new byte[32000],()->true));assertEquals(1,freed.get());assertEquals(0,bytes.get());e.close();}
 @Test public void missingAndFailedModelDoNotInventResult(){LocalVoskEngine e=engine(false);assertThrows(IllegalStateException.class,()->e.recognize(new byte[32000],()->false));LocalVoskEngine broken=new LocalVoskEngine(()->{throw new java.io.IOException("mock bad model");});assertThrows(java.io.IOException.class,broken::initialize);broken.close();}
}
