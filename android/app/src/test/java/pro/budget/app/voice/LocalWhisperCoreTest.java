package pro.budget.app.voice;
import org.junit.Test;
import static org.junit.Assert.*;
import java.nio.*;
import java.util.concurrent.atomic.AtomicInteger;
public class LocalWhisperCoreTest {
 private byte[] wav(){byte[] w=new byte[32044];ByteBuffer b=ByteBuffer.wrap(w).order(ByteOrder.LITTLE_ENDIAN);b.putInt(0,0x46464952);b.putInt(4,w.length-8);b.putInt(8,0x45564157);b.putInt(12,0x20746d66);b.putInt(16,16);b.putShort(20,(short)1);b.putShort(22,(short)1);b.putInt(24,16000);b.putInt(28,32000);b.putShort(32,(short)2);b.putShort(34,(short)16);b.putInt(36,0x61746164);b.putInt(40,w.length-44);return w;}
 @Test public void pcmFormatBoundsAndFloatScaling(){
  byte[] w=wav();ByteBuffer b=ByteBuffer.wrap(w).order(ByteOrder.LITTLE_ENDIAN);b.putShort(44,(short)0x7FFF);b.putShort(46,(short)0x8000);b.putShort(48,(short)0);
  byte[] pcm=LocalWhisperPcm.pcm(w);assertEquals(32000,pcm.length);
  float[] samples=LocalWhisperPcm.floats(pcm);assertEquals(16000,samples.length);
  assertEquals(0.99997f,samples[0],0.0001f);assertEquals(-1f,samples[1],0f);assertEquals(0f,samples[2],0f);
  for(int offset:new int[]{0,4,8,12,16,20,22,24,28,32,34,36,40}){byte[] x=wav();x[offset]^=1;assertThrows(IllegalArgumentException.class,()->LocalWhisperPcm.pcm(x));}
  assertThrows(IllegalArgumentException.class,()->LocalWhisperPcm.pcm(new byte[10]));
  assertThrows(IllegalArgumentException.class,()->LocalWhisperPcm.pcm(new byte[960046]));
  assertThrows(IllegalArgumentException.class,()->LocalWhisperPcm.floats(new byte[3]));
  assertThrows(IllegalArgumentException.class,()->LocalWhisperPcm.floats(new byte[0]));
  assertEquals(480000,LocalWhisperPcm.MAX_SAMPLES);
 }
 private final AtomicInteger models=new AtomicInteger(),closed=new AtomicInteger(),cancels=new AtomicInteger(),runs=new AtomicInteger();
 private LocalWhisperEngine engine(boolean fail){return new LocalWhisperEngine(()->{models.incrementAndGet();return new LocalWhisperEngine.Model(){public LocalWhisperEngine.Result transcribe(float[] pcm,String language,LocalWhisperEngine.Cancellation cancelled)throws Exception{runs.incrementAndGet();if(fail)throw new Exception("mock native failure");return new LocalWhisperEngine.Result(" რვა ლარი ","ka",2,0.25f);}public void cancel(){cancels.incrementAndGet();}public void close(){closed.incrementAndGet();}};});}
 @Test public void warmReuseReleaseAndReinitialize()throws Exception{
  LocalWhisperEngine e=engine(false);assertTrue(e.initialize());assertFalse(e.initialize());
  assertEquals(" რვა ლარი ",e.transcribe(new float[16000],"ka",()->false).text);
  assertEquals(" რვა ლარი ",e.transcribe(new float[16000],"ka",()->false).text);
  assertEquals(1,models.get());assertEquals(2,runs.get());e.close();e.close();assertEquals(1,closed.get());
  assertTrue(e.initialize());e.close();assertEquals(2,closed.get());
 }
 @Test public void resultKeepsLanguageSegmentsAndNoSpeechProbability()throws Exception{
  LocalWhisperEngine e=engine(false);e.initialize();
  LocalWhisperEngine.Result result=e.transcribe(new float[16000],"ka",()->false);
  assertEquals("ka",result.language);assertEquals(2,result.segments);assertEquals(0.25f,result.noSpeechProb,0f);
  e.close();
 }
 @Test public void cancellationBeforeAndAfterRunZeroesSamples()throws Exception{
  LocalWhisperEngine e=engine(false);e.initialize();
  float[] before=new float[16000];java.util.Arrays.fill(before,0.5f);
  assertThrows(InterruptedException.class,()->e.transcribe(before,"ru",()->true));assertEquals(0,runs.get());
  for(float v:before)assertEquals(0f,v,0f);
  float[] after=new float[16000];java.util.Arrays.fill(after,0.5f);
  assertThrows(InterruptedException.class,()->e.transcribe(after,"ru",new LocalWhisperEngine.Cancellation(){public boolean getAsBoolean(){return runs.get()>0;}}));
  assertEquals(1,runs.get());
  for(float v:after)assertEquals(0f,v,0f);
  e.cancel();assertEquals(1,cancels.get());e.close();
 }
 @Test public void invalidInputAndMissingModelNeverInventResult()throws Exception{
  LocalWhisperEngine e=engine(false);
  assertThrows(IllegalStateException.class,()->e.transcribe(new float[16000],"ru",()->false));
  e.initialize();
  assertThrows(IllegalArgumentException.class,()->e.transcribe(new float[0],"ru",()->false));
  assertThrows(IllegalArgumentException.class,()->e.transcribe(new float[LocalWhisperPcm.MAX_SAMPLES+1],"ru",()->false));
  assertThrows(IllegalArgumentException.class,()->e.transcribe(null,"ru",()->false));
  LocalWhisperEngine broken=new LocalWhisperEngine(()->{throw new java.io.IOException("mock bad model");});
  assertThrows(java.io.IOException.class,broken::initialize);broken.close();assertEquals(0,closed.get());
 }
 @Test public void failedRunPropagatesAndZeroesSamples()throws Exception{
  LocalWhisperEngine e=engine(true);e.initialize();
  float[] pcm=new float[16000];java.util.Arrays.fill(pcm,0.5f);
  assertThrows(Exception.class,()->e.transcribe(pcm,"en",()->false));
  for(float v:pcm)assertEquals(0f,v,0f);
  e.close();assertEquals(1,closed.get());
 }
 @Test public void oneBundledModelCoversRuEnKaAndAuto(){
  for(String language:new String[]{"ru","en","ka"," RU ","Ka","auto"})assertTrue(String.valueOf(language),LocalWhisperService.supportsLanguage(language));
  for(String language:new String[]{null,"","uk","ru-RU","de"})assertFalse(String.valueOf(language),LocalWhisperService.supportsLanguage(language));
  assertEquals("ggml-small-q5_1",LocalWhisperService.MODEL);
 }
}
