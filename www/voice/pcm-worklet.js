class BudgetPCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();this.buffer=new Float32Array(1024);this.offset=0;this.sequence=0;this.samples=0;this.accepting=true;
    this.port.onmessage=({data})=>{if(data?.type==='stop'&&this.accepting){this.accepting=false;this.flush();this.port.postMessage({type:'stopped',sequence:this.sequence,samples:this.samples});}};
  }
  flush(){if(!this.offset)return;const samples=this.buffer.slice(0,this.offset);this.samples+=samples.length;this.port.postMessage({type:'pcm',sequence:++this.sequence,samples},[samples.buffer]);this.offset=0;}
  process(inputs,outputs){
    const channels=inputs[0];if(this.accepting&&channels?.length){for(let i=0;i<channels[0].length;i++){let sample=0;for(const channel of channels)sample+=channel[i]||0;this.buffer[this.offset++]=sample/channels.length;if(this.offset===1024)this.flush();}}
    for(const channel of outputs[0]||[])channel.fill(0);return true;
  }
}
registerProcessor('budget-pcm',BudgetPCMProcessor);
