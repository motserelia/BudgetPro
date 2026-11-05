// Preserve PCM from the first worklet frame, independent of VAD onset (verified Voice Test v3 path).
(function(root){'use strict';
 const workletURL=new URL('pcm-worklet.js',document.currentScript.src).href;
 const error=code=>Object.assign(Error(code),{code});
 class Recorder {
  constructor(mode,onFrame){this.mode=mode;this.onFrame=onFrame;this.detector=new root.VoiceActivityDetector.Detector(mode);this.frames=[];this.closed=false;this.finishing=null;this.sampleCount=0;this.sequence=0;this.metrics={bufferCount:0,capturedSourceSamples:0,discardedSourceSamples:0,flushAcknowledged:false};}
  async start(){
   if(this.started||this.closed)throw error('MICROPHONE_ALREADY_USED');this.started=true;this.metrics.microphoneRequestedAt=Date.now();
   if(!navigator.mediaDevices?.getUserMedia)throw error('MICROPHONE_MISSING');
   try{
    const supported=navigator.mediaDevices.getSupportedConstraints(),audio={};for(const [k,v] of Object.entries({channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:this.mode!=='quiet'}))if(supported[k])audio[k]={ideal:v};
    const stream=await navigator.mediaDevices.getUserMedia({audio});if(this.closed){stream.getTracks().forEach(t=>t.stop());throw error('MICROPHONE_CANCELLED');}this.stream=stream;this.metrics.microphoneAcquiredAt=Date.now();const track=stream.getAudioTracks?.()[0]||stream.getTracks()[0],settings=track?.getSettings?.()||{};for(const [key,value]of Object.entries({trackSampleRate:settings.sampleRate,trackChannels:settings.channelCount,trackSampleSize:settings.sampleSize,echoCancellation:settings.echoCancellation,noiseSuppression:settings.noiseSuppression,autoGainControl:settings.autoGainControl})){if(['number','boolean'].includes(typeof value))this.metrics[key]=value;}
    this.context=new AudioContext();this.sampleRate=this.context.sampleRate;Object.assign(this.metrics,{sourceSampleRate:this.sampleRate,sampleRate:16000,channels:1,captureFormat:'PCM16 WAV'});this.metrics.audioContextCreatedAt=Date.now();await this.context.audioWorklet.addModule(workletURL);if(this.closed)throw error('MICROPHONE_CANCELLED');this.metrics.workletReadyAt=Date.now();
    this.source=this.context.createMediaStreamSource(stream);this.node=new AudioWorkletNode(this.context,'budget-pcm',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1]});
    let timer;const firstFrame=new Promise((resolve,reject)=>{this.firstResolve=resolve;this.firstReject=reject;timer=setTimeout(()=>reject(error('MICROPHONE_FIRST_FRAME_TIMEOUT')),3000);this.firstTimer=timer;});
    firstFrame.catch(()=>{});
    this.node.port.onmessage=({data})=>{try{if(data?.type==='pcm'){if(data.sequence!==this.sequence+1)throw error('MICROPHONE_BUFFER_SEQUENCE');this.sequence=data.sequence;this.frame(data.samples);}else if(data?.type==='stopped'){if(data.sequence!==this.sequence||data.samples!==this.sampleCount)throw error('MICROPHONE_BUFFER_COUNT');this.metrics.flushAcknowledged=true;this.stopResolve?.();}}catch(e){this.captureError=e;this.firstReject?.(e);this.stopReject?.(e);}};
    this.source.connect(this.node);this.node.connect(this.context.destination);try{await this.context.resume();await firstFrame;}finally{clearTimeout(timer);this.firstReject=this.firstResolve=null;}
    if(this.closed)throw error('MICROPHONE_CANCELLED');this.metrics.recordingReadyAt=Date.now();
   }catch(e){await this.close();throw e?.name==='NotAllowedError'||e?.name==='PermissionDeniedError'?error('MICROPHONE_PERMISSION_DENIED'):e;}
  }
  frame(samples){
   if(this.closed)return;if(!(samples instanceof Float32Array)||!samples.length||!samples.every(Number.isFinite))throw error('MICROPHONE_INVALID_PCM');
   if(this.sampleCount+samples.length>this.sampleRate*30)throw error('MICROPHONE_DURATION_LIMIT');
   this.frames.push(samples);this.sampleCount+=samples.length;this.metrics.bufferCount++;this.metrics.capturedSourceSamples=this.sampleCount;
   const m=this.detector.process(samples,this.sampleRate);if(!this.metrics.firstFrameAt){this.metrics.firstFrameAt=Date.now();this.metrics.firstBufferRMS=m.rms;this.metrics.firstBufferPeak=m.peak;}if(this.detector.speechDuration>0&&!this.metrics.firstSpeechAt)this.metrics.firstSpeechAt=Date.now();if(this.detector.started&&!this.metrics.vadStartedAt)this.metrics.vadStartedAt=Date.now();Object.assign(this.metrics,m);this.firstResolve?.();this.onFrame({...this.metrics});
  }
  async close(){
   if(this.closed)return;this.closed=true;clearTimeout(this.firstTimer);this.firstReject?.(error('MICROPHONE_CANCELLED'));this.stopReject?.(error('MICROPHONE_CANCELLED'));
   if(this.node){this.node.port.onmessage=null;this.node.port.close();this.node.disconnect();}this.source?.disconnect();this.stream?.getTracks().forEach(t=>t.stop());
   if(this.context&&this.context.state!=='closed')await this.context.close();this.node=this.source=this.stream=null;
   for(const f of this.frames)f.fill(0);this.frames=[];
  }
  finish(){if(this.finishing)return this.finishing;this.finishing=this.finishOnce();return this.finishing;}
  async finishOnce(){
   if(this.closed||!this.node)throw error('MICROPHONE_NOT_READY');this.metrics.captureStopRequestedAt=Date.now();let timer,input,pcm;
   try{
    await new Promise((resolve,reject)=>{this.stopResolve=resolve;this.stopReject=reject;timer=setTimeout(()=>reject(error('MICROPHONE_FLUSH_TIMEOUT')),1000);this.node.port.postMessage({type:'stop'});});clearTimeout(timer);this.stopResolve=this.stopReject=null;
    if(this.captureError)throw this.captureError;
    input=new Float32Array(this.sampleCount);let offset=0;for(const f of this.frames){input.set(f,offset);offset+=f.length;}
    await this.close();this.metrics.captureStoppedAt=Date.now();pcm=root.VoicePCM.resample(input,this.sampleRate);
    let sum=0,peak=0;for(const s of pcm){sum+=s*s;peak=Math.max(peak,Math.abs(s));}const rms=Math.sqrt(sum/Math.max(1,pcm.length));
    if(pcm.length<3520||this.detector.speechDuration<220&&rms<this.detector.config.minimum)throw error('NO_SPEECH');
    const gain=this.mode==='quiet'?Math.min(2,.08/Math.max(.0001,rms),.9/Math.max(.0001,peak)):1;if(gain>1)for(let i=0;i<pcm.length;i++)pcm[i]*=gain;
    return {wav:root.VoicePCM.wav(pcm),metrics:{...this.metrics,captureFormat:'PCM16 WAV',sampleRate:16000,sourceSampleRate:this.sampleRate,channels:1,duration:pcm.length/16,speechDuration:this.detector.speechDuration,RMS:rms,peak,noiseFloor:this.detector.noiseFloor,gain:Math.max(1,gain),vadEnergyFallback:this.detector.speechDuration<220,resampledSamples:pcm.length}};
   }finally{clearTimeout(timer);this.stopResolve=this.stopReject=null;await this.close();input?.fill(0);pcm?.fill(0);}
  }
 }
 root.VoiceRecorder=Recorder;
})(globalThis);
