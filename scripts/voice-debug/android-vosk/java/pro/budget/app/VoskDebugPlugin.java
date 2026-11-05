package pro.budget.app;
import android.content.*;
import android.content.pm.ApplicationInfo;
import android.os.*;
import android.util.Base64;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Arrays;
import java.util.concurrent.*;
/** Debug-only Capacitor facade. No microphone permission request or cloud code. */
@CapacitorPlugin(name="BudgetPROVoskDebug")
public final class VoskDebugPlugin extends Plugin {
    private final Handler main=new Handler(Looper.getMainLooper());
    private final ExecutorService io=Executors.newSingleThreadExecutor();
    private volatile Messenger service;private boolean bound;private volatile PluginCall pending;private int sequence;private Runnable connected,timeout;
    private final Messenger replies=new Messenger(new Handler(Looper.getMainLooper(),m->{
        Bundle b=m.getData();if(pending==null||b.getInt("id")!=sequence)return true;
        PluginCall call=pending;pending=null;main.removeCallbacks(timeout);
        if(b.getString("error")!=null)call.reject(b.getString("error"),b.getString("error"));
        else try{call.resolve(new JSObject(b.getString("json")));}catch(Exception e){call.reject("VOSK_BAD_RESPONSE","VOSK_BAD_RESPONSE");}
        return true;
    }));
    private final ServiceConnection connection=new ServiceConnection(){
        public void onServiceConnected(ComponentName n,IBinder binder){service=new Messenger(binder);Runnable r=connected;connected=null;if(r!=null)r.run();}
        public void onServiceDisconnected(ComponentName n){service=null;reject("VOSK_PROCESS_STOPPED");}
        public void onBindingDied(ComponentName n){service=null;reject("VOSK_PROCESS_STOPPED");disconnect();}
        public void onNullBinding(ComponentName n){reject("VOSK_DEBUG_ONLY");disconnect();}
    };
    private void reject(String code){connected=null;if(pending!=null){PluginCall call=pending;pending=null;if(timeout!=null)main.removeCallbacks(timeout);call.reject(code,code);}}
    private void disconnect(){connected=null;if(bound){try{getContext().unbindService(connection);}catch(Exception ignored){}bound=false;}service=null;}
    private void signal(int action){if(service!=null)try{Message m=Message.obtain(null,action);m.replyTo=replies;m.setData(new Bundle());service.send(m);}catch(Exception ignored){}}
    private void request(PluginCall call,int action){main.post(()->{
        if((getContext().getApplicationInfo().flags&ApplicationInfo.FLAG_DEBUGGABLE)==0){call.reject("VOSK_DEBUG_ONLY","VOSK_DEBUG_ONLY");return;}
        if(pending!=null){call.reject("VOSK_BUSY","VOSK_BUSY");return;}
        final String encoded=action==VoskDebugService.TRANSCRIBE?call.getString("wavBase64"):null;
        if(action==VoskDebugService.TRANSCRIBE&&(encoded==null||encoded.length()>1280060)){call.reject("VOSK_INVALID_WAV","VOSK_INVALID_WAV");return;}
        pending=call;final int id=++sequence;
        timeout=()->{reject("VOSK_TIMEOUT");signal(VoskDebugService.CANCEL);signal(VoskDebugService.RELEASE);disconnect();};main.postDelayed(timeout,60000);
        Runnable send=()->io.execute(()->{
            if(pending!=call)return;
            byte[] wav=null;ParcelFileDescriptor[] pipe=null;
            try{
                if(encoded!=null){wav=Base64.decode(encoded,Base64.NO_WRAP);byte[] pcm=VoskPcm.pcm(wav);Arrays.fill(pcm,(byte)0);pipe=ParcelFileDescriptor.createPipe();}
                Message m=Message.obtain(null,action);Bundle b=new Bundle();b.putInt("id",id);if(pipe!=null)b.putParcelable("audio",pipe[0]);m.setData(b);m.replyTo=replies;
                if(pending!=call)return;Messenger target=service;if(target==null)throw new IllegalStateException();target.send(m);
                if(pipe!=null){pipe[0].close();try(java.io.OutputStream out=new ParcelFileDescriptor.AutoCloseOutputStream(pipe[1])){out.write(wav);}}
            }catch(Exception|OutOfMemoryError e){main.post(()->{if(sequence==id)reject(e instanceof OutOfMemoryError?"VOSK_LOW_MEMORY":"VOSK_INPUT_OR_SERVICE_ERROR");});}
            finally{if(wav!=null)Arrays.fill(wav,(byte)0);if(pipe!=null)for(ParcelFileDescriptor fd:pipe)try{fd.close();}catch(Exception ignored){}}
        });
        if(service!=null)send.run();else {connected=send;if(!bound){bound=getContext().bindService(new Intent(getContext(),VoskDebugService.class),connection,Context.BIND_AUTO_CREATE);if(!bound)reject("VOSK_BIND_FAILED");}}
    });}
    @PluginMethod public void initialize(PluginCall call){request(call,VoskDebugService.INIT);}
    @PluginMethod public void transcribe(PluginCall call){request(call,VoskDebugService.TRANSCRIBE);}
    @PluginMethod public void selfTest(PluginCall call){request(call,VoskDebugService.SELF_TEST);}
    @PluginMethod public void release(PluginCall call){request(call,VoskDebugService.RELEASE);}
    @PluginMethod public void cancel(PluginCall call){main.post(()->{reject("VOSK_CANCELLED");signal(VoskDebugService.CANCEL);signal(VoskDebugService.RELEASE);call.resolve(new JSObject().put("cancelled",true));});}
    @Override protected void handleOnPause(){main.post(()->{if(pending!=null){reject("VOSK_CANCELLED");signal(VoskDebugService.CANCEL);}signal(VoskDebugService.RELEASE);});}
    @Override protected void handleOnDestroy(){main.post(()->{reject("VOSK_CANCELLED");signal(VoskDebugService.CANCEL);signal(VoskDebugService.RELEASE);disconnect();});io.shutdownNow();}
}
