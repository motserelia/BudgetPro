package pro.budget.app.voice;
import org.junit.Test;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import static org.junit.Assert.*;
public class LocalVoskModelTest {
    private static final Map<String,String> EXPECTED=new LinkedHashMap<String,String>();
    static {
        EXPECTED.put("ru","vosk-model-small-ru-0.22");
        EXPECTED.put("ka","vosk-model-small-ka-0.42");
        EXPECTED.put("en","vosk-model-small-en-us-0.15");
    }
    @Test public void eachLanguageSelectsItsOwnModel(){
        for(Map.Entry<String,String> entry:EXPECTED.entrySet()){
            assertTrue(entry.getKey(),LocalVoskService.supportsLanguage(entry.getKey()));
            assertEquals(entry.getKey(),entry.getValue(),modelName(entry.getKey()));
        }
    }
    @Test public void languageIsTrimmedAndCaseInsensitive(){
        assertEquals("vosk-model-small-ru-0.22",modelName(" RU "));
        assertEquals("vosk-model-small-ka-0.42",modelName("Ka"));
    }
    @Test public void unknownOrMissingLanguageNeverFallsBackToGeorgian()throws IOException{
        for(String language:new String[]{null,"","auto","uk","ru-RU"}){
            assertFalse(String.valueOf(language),LocalVoskService.supportsLanguage(language));
            try{LocalVoskService.modelName(language);fail("expected VOSK_LANGUAGE_REQUIRED for "+language);}
            catch(IOException e){assertEquals("VOSK_LANGUAGE_REQUIRED",e.getMessage());}
        }
    }
    private static String modelName(String language){try{return LocalVoskService.modelName(language);}catch(IOException e){throw new AssertionError(e.getMessage(),e);}}
}
