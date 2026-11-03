import {RULES} from './model.mjs';
export const AVATARS=[{id:'lion',label:'Lion',emoji:'🦁'},{id:'fox',label:'Fox',emoji:'🦊'},{id:'cat',label:'Cat',emoji:'🐱'},{id:'panda',label:'Panda',emoji:'🐼'},{id:'koala',label:'Koala',emoji:'🐨'},{id:'frog',label:'Frog',emoji:'🐸'},{id:'owl',label:'Owl',emoji:'🦉'},{id:'penguin',label:'Penguin',emoji:'🐧'},{id:'bear',label:'Bear',emoji:'🐻'},{id:'rabbit',label:'Rabbit',emoji:'🐰'}];
export const PROFILE_STORE='nsimbi-profile-v1';
export const defaultProfile=()=>({avatar:'',name:'James Okello',username:'James',email:'james@example.com',phone:RULES.phone,tier:1,theme:'light',hideBalance:false,paymentUpdates:true,productNews:false});
export function restoreProfile(raw){try{const p=JSON.parse(raw)||{},d=defaultProfile();return {...d,avatar:typeof p.avatar==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(p.avatar)&&p.avatar.length<2000000?p.avatar:p.avatar?.kind==='emoji'&&AVATARS.some(a=>a.id===p.avatar.id)?{kind:'emoji',id:p.avatar.id}:'',name:d.name,username:typeof p.username==='string'&&/^[a-zA-Z0-9._]{2,24}$/.test(p.username)?p.username:typeof p.name==='string'&&/^[a-zA-Z0-9._]{2,24}$/.test(p.name)?p.name:d.username,tier:[1,2,3].includes(p.tier)?p.tier:1,theme:p.theme==='dark'?'dark':'light',...Object.fromEntries(['hideBalance','paymentUpdates','productNews'].map(key=>[key,typeof p[key]==='boolean'?p[key]:d[key]]))};}catch{return defaultProfile();}}
export const initials=name=>name.trim().split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
export const TIERS=[
 {id:1,name:'Basic',summary:'Your account essentials',checks:['Phone number','Account email']},
 {id:2,name:'Identity',summary:'Confirm who you are',checks:['Government-issued identity document','Selfie check']},
 {id:3,name:'Enhanced',summary:'Additional account review',checks:['Residential address','Source of funds','Additional review']}
];
export const SERVICES=[
 {id:'save',title:'Save',icon:'ShieldCheck',summary:'Set money aside',description:'Put money towards a goal and understand when you can access it.',details:['Your saving goal','Access and withdrawal terms','Any applicable charges']},
 {id:'invest',title:'Invest',icon:'TrendingUp',summary:'Explore your options',description:'Understand an investment before deciding whether it suits you.',details:['Risk and product information','Charges and fees','Access to your investment']},
 {id:'loans',title:'Loans',icon:'Landmark',summary:'Understand borrowing',description:'Review the full cost and repayment terms before accepting an offer.',details:['Amount and total repayment','Fees and repayment dates','Eligibility and affordability']},
 {id:'goods',title:'Buy goods',icon:'ShoppingBag',summary:'Pay a merchant',description:'Check the merchant and payment details before approving a purchase.',details:['Merchant name and identifier','Purchase amount','Payment confirmation']},
 {id:'invoices',title:'Invoices',icon:'FileText',summary:'Keep payments organised',description:'Create a clear payment request and track its status.',details:['Customer and invoice details','Items and payment due date','Payment status']},
 {id:'sell',title:'Sell',icon:'Smartphone',summary:'Get paid for your work',description:'Keep a record of a sale and the payment attached to it.',details:['Sale details','Customer payment request','Payment record']}
];
