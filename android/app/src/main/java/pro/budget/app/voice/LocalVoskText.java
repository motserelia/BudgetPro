package pro.budget.app.voice;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
/** Confirmed endpoint segments only. No partial guesses, logging or persistent text history. */
public final class LocalVoskText {
    private final List<String> parts=new ArrayList<>();
    private boolean finished;
    public void append(String json)throws Exception {
        if(finished)throw new IllegalStateException("VOSK_RECOGNIZER_FAILED");
        JSONObject result=new JSONObject(json);
        if(result.has("alternatives")||!(result.opt("text") instanceof String))throw new IllegalArgumentException("VOSK_RECOGNIZER_FAILED");
        String text=result.getString("text").trim();if(!text.isEmpty())parts.add(text);
    }
    public void finish(String json)throws Exception {append(json);finished=true;}
    public String transcript(){
        if(!finished)throw new IllegalStateException("VOSK_RECOGNIZER_FAILED");
        StringBuilder text=new StringBuilder();for(String part:parts){if(text.length()>0)text.append(' ');text.append(part);}return text.toString();
    }
}
