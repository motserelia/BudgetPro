package pro.budget.app.voice;
import org.junit.Test;
import static org.junit.Assert.*;
public class LocalVoskTextTest {
 @Test public void emptyFinalPreservesConfirmedSegments()throws Exception{LocalVoskText t=new LocalVoskText();t.append("{\"text\":\"ყავაში რვა ლარი გადავიხადე\"}");t.finish("{\"text\":\"\"}");assertEquals("ყავაში რვა ლარი გადავიხადე",t.transcript());}
 @Test public void multipleSegmentsJoinOnce()throws Exception{LocalVoskText t=new LocalVoskText();t.append("{\"text\":\"Потратил восемь\"}");t.append("{\"text\":\"лари на кофе\"}");t.finish("{\"text\":\"\"}");assertEquals("Потратил восемь лари на кофе",t.transcript());assertThrows(IllegalStateException.class,()->t.finish("{\"text\":\"again\"}"));}
 @Test public void silenceIsEmptyAndMalformedSdkNeverBecomesMoney()throws Exception{LocalVoskText t=new LocalVoskText();t.finish("{\"text\":\"\"}");assertEquals("",t.transcript());assertThrows(Exception.class,()->new LocalVoskText().append("bad"));assertThrows(Exception.class,()->new LocalVoskText().append("{\"partial\":\"восемь\"}"));assertThrows(Exception.class,()->new LocalVoskText().append("{\"alternatives\":[{\"text\":\"8\"}]}"));}
}
