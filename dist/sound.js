// Small, self-contained soundscape. No downloads and no background timers.
export class IslandSound {
  constructor({muted=false,volume=.55,music=true}={}) {
    this.muted=muted;this.volume=volume;this.music=music;this.active=false;
    this.voices=new Set();this.nextStep=0;this.nextBird=0;this.nextDino=0;this.nextNote=0;this.note=0;this.region='';
  }
  unlock() {
    try {
      if(!this.ctx){
        const Context=globalThis.AudioContext||globalThis.webkitAudioContext;
        if(!Context)return;
        this.ctx=new Context();this.master=this.ctx.createGain();
        const compressor=this.ctx.createDynamicsCompressor();compressor.threshold.value=-18;compressor.ratio.value=5;
        this.master.connect(compressor);compressor.connect(this.ctx.destination);
        this.noise=this.ctx.createBuffer(1,this.ctx.sampleRate*2,this.ctx.sampleRate);
        const a=this.noise.getChannelData(0);let smooth=0;
        for(let i=0;i<a.length;i++){smooth=(smooth+(Math.random()*2-1)*.12)/1.12;a[i]=smooth*3;}
        this.master.gain.value=this.muted?0:this.volume;
      }
      if(!this.muted&&this.ctx.state!=='running')this.ctx.resume().catch(()=>{});
    }catch{/* Audio must never prevent playing. */}
  }
  configure({muted=this.muted,volume=this.volume,music=this.music}={}) {
    const musicChanged=music!==this.music;
    this.muted=!!muted;this.volume=Math.max(0,Math.min(1,Number(volume)||0));this.music=!!music;
    if(this.muted||musicChanged)this.clear();
    if(this.ctx)this.master.gain.setTargetAtTime(this.muted?0:this.volume,this.ctx.currentTime,.03);
    if(!this.muted)this.unlock();
  }
  setActive(active){
    this.active=active;
    if(!active){this.clear();if(this.ctx?.state==='running')this.ctx.suspend().catch(()=>{});}
    else this.unlock();
  }
  clear(){
    for(const v of [...this.voices]){try{v.source.stop();}catch{}v.clean();}
    this.wind=null;this.nextNote=0;this.nextBird=0;this.nextDino=0;this.nextStep=0;
  }
  track(source,nodes){
    const v={source,clean:()=>{source.disconnect();for(const n of nodes)n.disconnect();this.voices.delete(v);}};
    source.onended=v.clean;this.voices.add(v);return source;
  }
  tone(freq,duration=.2,gain=.12,delay=0,type='sine',end=freq){
    if(!this.ctx||this.muted||this.ctx.state!=='running'||this.voices.size>32)return;
    const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+duration);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g);g.connect(this.master);this.track(o,[g]);o.start(t);o.stop(t+duration+.03);
  }
  rustle(duration=.15,gain=.15,freq=900,delay=0){
    if(!this.ctx||this.muted||this.ctx.state!=='running'||this.voices.size>32)return;
    const t=this.ctx.currentTime+delay,s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();
    s.buffer=this.noise;f.type='bandpass';f.frequency.value=freq;f.Q.value=.7;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    s.connect(f);f.connect(g);g.connect(this.master);this.track(s,[f,g]);s.start(t);s.stop(t+duration+.02);
  }
  chime(notes,gain=.09){notes.forEach((f,i)=>{this.tone(f,.65,gain,i*.13);this.tone(f*2,.3,gain*.16,i*.13);});}
  dino(index=0,baby=false,gain=.07){
    const f=([145,100,190,82,115,480,135,65,210,320,240][index]||145)*(baby?1.9:1);
    this.tone(f,.65,gain,0,'triangle',f*1.38);this.tone(f*1.38,.55,gain*.75,.32,'sine',f*.85);
  }
  play(name,material){
    if(this.muted)return;this.unlock();
    switch(name){
      case 'start':case 'home':this.chime([392,494,587,784]);break;
      case 'hatch':this.rustle(.16,.22,1800);this.rustle(.12,.13,2600,.15);this.chime([523,659,784,1047],.12);this.dino(material??0,true,.06);break;
      case 'friend':this.chime([392,523,659,784],.11);break;
      case 'feed':this.rustle(.09,.19,1200);this.rustle(.08,.15,1500,.13);this.tone(340,.22,.05,.12,'sine',460);break;
      case 'mount':this.dino(material);this.chime([392,523],.07);break;
      case 'craft':this.tone(220,.1,.1,0,'triangle');this.tone(330,.1,.1,.12,'triangle');this.chime([659,880],.07);break;
      case 'jump':this.tone(180,.18,.055,0,'sine',370);break;
      case 'swing':this.rustle(.2,.22,1700);this.tone(280,.15,.04,0,'triangle',120);break;
      case 'hit':this.rustle(.12,.16,500);this.tone(160,.12,.1,0,'triangle',90);break;
      case 'victory':this.chime([392,494,587],.08);break;
      case 'treasure':this.chime([523,659,784,1047],.09);break;
      case 'hurt':this.tone(220,.2,.07,0,'triangle',140);break;
      case 'scare':this.rustle(.25,.15,650);this.dino(material,false,.06);break;
      case 'place':this.tone(material==='wood'?180:120,.13,.16,0,'sine',65);this.rustle(.1,.1,600);break;
      case 'break':
        this.rustle(.22,.27,material==='leaf'?2200:material==='sand'?1400:750);
        if(!['leaf','sand','grass','dirt'].includes(material))this.tone(material==='wood'?240:620,.13,.12,0,'triangle',material==='wood'?120:410);
        break;
    }
  }
  tick({time,rain=false,moving,grounded,region,near,mounted}){
    if(!this.active||this.muted||!this.ctx||this.ctx.state!=='running')return;
    if(!this.wind){
      const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=this.noise;s.loop=true;f.type='lowpass';f.frequency.value=600;g.gain.value=0;
      s.connect(f);f.connect(g);g.connect(this.master);this.track(s,[f,g]);s.start();this.wind={g,f};
    }
    const beach=region.includes('plage'),volcano=region.includes('volcan'),jungle=region.includes('jungle')||region.includes('forêt')||region.includes('marais');
    this.wind.f.frequency.setTargetAtTime(rain?2200:beach?1000:volcano?180:550,this.ctx.currentTime,.5);
    this.wind.g.gain.setTargetAtTime((rain?.095:beach?.075:volcano?.065:.025)*(1+Math.sin(time*.65)*.35),this.ctx.currentTime,.3);
    if(moving&&grounded&&time>=this.nextStep){this.rustle(.09,mounted?.22:.11,beach?1600:700);this.tone(mounted?75:115,.1,mounted?.1:.035);this.nextStep=time+(mounted?.37:.43);}
    if(jungle&&time>=this.nextBird){this.tone(1450,.12,.035,0,'sine',2200);this.tone(1800,.16,.026,.2,'sine',1250);this.nextBird=time+7+Math.random()*6;}
    if(near&&time>=this.nextDino){this.dino(near.index,near.baby,.055);this.nextDino=time+9+Math.random()*7;}
    if(this.music&&time>=this.nextNote){const tune=[392,0,494,587,0,494,440,0,330,392,0,494,0,440,330,0],f=tune[this.note++%tune.length];if(f)this.tone(f,1.65,.025,0,'sine');this.nextNote=time+.8;}
  }
}
