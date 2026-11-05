package pro.budget.app;
import android.app.Service;
import android.app.ActivityManager;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.os.*;
import org.json.*;
import org.vosk.*;
import java.io.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
/** Non-exported separate process. Only bundled model files are written; audio uses a pipe. */
public final class VoskDebugService extends Service {
    static final int INIT=1, TRANSCRIBE=2, RELEASE=3, CANCEL=4, SELF_TEST=5;
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final AtomicInteger generation=new AtomicInteger();
    private VoskEngine engine;
    private final Messenger inbox=new Messenger(new Handler(Looper.getMainLooper(),m->{
        if(m.what==CANCEL){generation.incrementAndGet();return true;}
        final int g=generation.get();final Bundle args=m.getData();final Messenger reply=m.replyTo;final int action=m.what;
        worker.execute(()->run(action,args,reply,g));return true;
    }));
    @Override public IBinder onBind(Intent intent){return (getApplicationInfo().flags&ApplicationInfo.FLAG_DEBUGGABLE)!=0?inbox.getBinder():null;}
    private void resources() throws Exception {
        ActivityManager.MemoryInfo mi=new ActivityManager.MemoryInfo();getSystemService(ActivityManager.class).getMemoryInfo(mi);
        if(mi.lowMemory || mi.availMem<512L*1024*1024)throw new IOException("VOSK_LOW_MEMORY");
    }
    private File modelDirectory() throws Exception {
        File dest=new File(getNoBackupFilesDir(),"vosk-model-small-ka-0.42");
        JSONObject manifest;
        try(InputStream in=getAssets().open("vosk-small-manifest.json")){manifest=new JSONObject(new String(readBounded(in,100000),java.nio.charset.StandardCharsets.UTF_8));}
        if(new StatFs(getNoBackupFilesDir().getAbsolutePath()).getAvailableBytes()<manifest.getLong("bytes")+50L*1024*1024)throw new IOException("VOSK_STORAGE_LOW");
        JSONArray files=manifest.getJSONArray("files");
        for(int i=0;i<files.length();i++){
            JSONObject item=files.getJSONObject(i);String name=item.getString("path");
            if(name.contains("..")||name.startsWith("/"))throw new IOException("VOSK_MODEL_INTEGRITY");
            File out=new File(dest,name);if(out.isFile()&&digest(out).equals(item.getString("sha256")))continue;
            if(!out.getParentFile().isDirectory()&&!out.getParentFile().mkdirs())throw new IOException("VOSK_MODEL_FAILED");
            File part=new File(out.getPath()+".part");
            try(InputStream in=getAssets().open("vosk-model-small-ka-0.42/"+name);OutputStream os=new FileOutputStream(part)){
                byte[] buf=new byte[32768];int n;while((n=in.read(buf))!=-1)os.write(buf,0,n);
            }
            if(!digest(part).equals(item.getString("sha256"))){part.delete();throw new IOException("VOSK_MODEL_INTEGRITY");}
            if(!part.renameTo(out)){part.delete();throw new IOException("VOSK_MODEL_FAILED");}
        }
        return dest;
    }
    private static String digest(File f)throws Exception {
        MessageDigest md=MessageDigest.getInstance("SHA-256");try(InputStream in=new FileInputStream(f)){byte[] b=new byte[32768];int n;while((n=in.read(b))!=-1)md.update(b,0,n);}
        StringBuilder s=new StringBuilder();for(byte b:md.digest())s.append(String.format(java.util.Locale.ROOT,"%02x",b&255));return s.toString();
    }
    static byte[] readBounded(InputStream in,int limit)throws IOException {
        ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] b=new byte[8192];int n,total=0;
        while((n=in.read(b))!=-1){total+=n;if(total>limit)throw new IOException("VOSK_INVALID_WAV");out.write(b,0,n);}return out.toByteArray();
    }
    private void initialize()throws Exception {
        if(engine==null)engine=new VoskEngine(()->{
            LibVosk.setLogLevel(LogLevel.WARNINGS);
            final Model model=new Model(modelDirectory().getAbsolutePath());
            return new VoskEngine.Backend(){
                public VoskEngine.Decoder decoder()throws Exception {
                    final Recognizer recognizer=new Recognizer(model,16000f);recognizer.setWords(true);
                    return new VoskEngine.Decoder(){
                        final List<String> parts=new ArrayList<>();
                        private void append(String json)throws Exception{String t=new JSONObject(json).optString("text","").trim();if(!t.isEmpty())parts.add(t);}
                        public void accept(byte[] pcm,int n)throws Exception{if(recognizer.acceptWaveForm(pcm,n))append(recognizer.getResult());}
                        public String finish()throws Exception{append(recognizer.getFinalResult());return android.text.TextUtils.join(" ",parts);}
                        public void close(){recognizer.close();}
                    };
                }
                public void close(){model.close();}
            };
        });
        engine.initialize();
    }
    private static long peakRssKiB(){
        try(BufferedReader r=new BufferedReader(new FileReader("/proc/self/status"))){String s;while((s=r.readLine())!=null)if(s.startsWith("VmHWM:"))return Long.parseLong(s.replaceAll("[^0-9]",""));}catch(Exception ignored){}return -1;
    }
    private void run(int action,Bundle args,Messenger reply,int g){
        JSONObject result=new JSONObject();byte[] wav=null,pcm=null;
        try {
            long wall=SystemClock.elapsedRealtimeNanos(),cpu=android.os.Process.getElapsedCpuTime();
            if(action==RELEASE){if(engine!=null)engine.close();engine=null;result.put("released",true);}
            else {
                resources();long init=SystemClock.elapsedRealtimeNanos();initialize();result.put("initializationMs",(SystemClock.elapsedRealtimeNanos()-init)/1e6);
                if(action==TRANSCRIBE){
                    ParcelFileDescriptor fd=args.getParcelable("audio");if(fd==null)throw new IOException("VOSK_INVALID_WAV");
                    try(InputStream in=new ParcelFileDescriptor.AutoCloseInputStream(fd)){wav=readBounded(in,VoskPcm.MAX_WAV);}
                    pcm=VoskPcm.pcm(wav);long start=SystemClock.elapsedRealtimeNanos(),c=android.os.Process.getElapsedCpuTime();
                    String text=engine.recognize(pcm,()->generation.get()!=g||Thread.currentThread().isInterrupted());
                    result.put("transcript",text);result.put("recognitionMs",(SystemClock.elapsedRealtimeNanos()-start)/1e6);result.put("recognitionCpuMs",android.os.Process.getElapsedCpuTime()-c);result.put("audioBytes",wav.length);
                }else if(action==SELF_TEST){
                    JSONArray timings=new JSONArray();for(int i=0;i<2;i++){long t=SystemClock.elapsedRealtimeNanos();String text=engine.recognize(new byte[32000],()->generation.get()!=g);timings.put(new JSONObject().put("ms",(SystemClock.elapsedRealtimeNanos()-t)/1e6).put("transcript",text));}
                    result.put("syntheticPcmOnly",true);result.put("runs",timings);engine.close();engine=null;result.put("resourcesReleased",true);
                }else if(action!=INIT)throw new IOException("VOSK_BAD_ACTION");
            }
            if(generation.get()!=g)throw new InterruptedException("VOSK_CANCELLED");
            result.put("elapsedMs",(SystemClock.elapsedRealtimeNanos()-wall)/1e6);result.put("cpuMs",android.os.Process.getElapsedCpuTime()-cpu);result.put("pssKiB",Debug.getPss());result.put("peakRssKiB",peakRssKiB());result.put("model","vosk-model-small-ka-0.42");result.put("offline",true);
            send(reply,args.getInt("id"),result.toString(),null);
        }catch(Exception|OutOfMemoryError|LinkageError error){
            if(engine!=null){try{engine.close();}catch(Throwable ignored){}engine=null;}
            String code=error instanceof OutOfMemoryError?"VOSK_LOW_MEMORY":error instanceof LinkageError?"VOSK_NATIVE_UNAVAILABLE":error.getMessage();
            if(code==null||!code.matches("VOSK_[A-Z_]+"))code="VOSK_LOCAL_ERROR";
            send(reply,args.getInt("id"),null,code);
        }finally{if(wav!=null)Arrays.fill(wav,(byte)0);if(pcm!=null)Arrays.fill(pcm,(byte)0);ParcelFileDescriptor fd=args.getParcelable("audio");if(fd!=null)try{fd.close();}catch(IOException ignored){}}
    }
    private void send(Messenger reply,int id,String json,String error){try{Message m=Message.obtain();Bundle b=new Bundle();b.putInt("id",id);b.putString("json",json);b.putString("error",error);m.setData(b);reply.send(m);}catch(Exception ignored){}}
    @Override public void onDestroy(){generation.incrementAndGet();worker.execute(()->{if(engine!=null)engine.close();engine=null;});worker.shutdown();super.onDestroy();}
}
