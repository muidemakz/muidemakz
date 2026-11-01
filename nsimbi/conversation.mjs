// Browser speech adapter. No recording or transcript is retained outside chat.
export function normalizeSpeech(text){
 const units={zero:0,oh:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
 const words=Object.keys(units).concat(['hundred','thousand','million']).join('|');
 return text.replace(/\bm\s+t\s+n\b/gi,'MTN').replace(new RegExp(`\\b(?:${words})(?:[ -]+(?:(?:and[ -]+)?(?:${words})))*\\b`,'gi'),phrase=>{const parts=phrase.toLowerCase().split(/[ -]+/).filter(w=>w!=='and');if(parts.length>1&&parts.every(w=>units[w]!==undefined&&units[w]<10))return parts.map(w=>units[w]).join('');let total=0,group=0;for(const w of parts){if(w==='hundred')group=(group||1)*100;else if(w==='thousand'||w==='million'){total+=(group||1)*(w==='thousand'?1000:1000000);group=0;}else group+=units[w];}return String(total+group);});
}
export function conversation({onChange,onText}){
 let active=false,recognition=null,epoch=0,mode='conversation';
 const emit=(phase,detail='')=>onChange({active,phase,detail,mode});
 function stop(){active=false;epoch++;recognition?.abort();recognition=null;window.speechSynthesis?.cancel();emit('idle');}
 function listen(){if(!active)return;const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){emit('unavailable','Voice is unavailable in this browser. Switch to typing to continue.');return;}
  const token=++epoch,r=new Recognition();recognition=r;r.lang='en-UG';r.interimResults=true;r.continuous=false;let received=false,failed=false;
  emit('connecting','Connecting microphone…');
  r.onstart=()=>{if(active&&token===epoch)emit('listening','Listening. Tell Nsimbi what you need.');};
  r.onresult=e=>{if(!active||token!==epoch)return;let final='',interim='';for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)final+=e.results[i][0].transcript;else interim+=e.results[i][0].transcript;}if(final.trim()&&!received){received=true;emit('thinking',final.trim());onText(normalizeSpeech(final.trim()));}else if(interim)emit('listening',interim);};
  r.onerror=e=>{if(!active||token!==epoch)return;failed=true;emit('error',e.error==='not-allowed'?'Microphone access was denied. Allow it in browser settings, or switch to typing.':e.error==='no-speech'?'No speech heard. Tap Try again when you’re ready.':'Could not connect to voice. Try again or switch to typing.');};
  r.onend=()=>{if(active&&token===epoch&&!received&&!failed)emit('paused','Microphone paused. Tap to listen again.');};
  try{r.start();}catch{emit('error','Microphone could not start. Try again or switch to typing.');}
 }
 function start(nextMode='conversation'){stop();mode=nextMode;active=true;listen();}
 function reply(text){if(!active)return;recognition?.abort();epoch++;const token=epoch;
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){listen();return;}
  emit('speaking','Nsimbi is speaking…');const u=new SpeechSynthesisUtterance(text);u.lang='en-UG';u.rate=1;u.onend=u.onerror=()=>{if(active&&token===epoch)listen();};window.speechSynthesis.cancel();window.speechSynthesis.speak(u);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){epoch++;recognition?.abort();window.speechSynthesis?.cancel();emit('paused','Voice paused while the app is in the background.');}});
 return {start,stop,listen,reply,get active(){return active;}};
}
