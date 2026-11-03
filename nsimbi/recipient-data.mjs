// Clearly labelled fixtures. No access to the device address book.
export const demoContacts=[{name:'James Okello',number:'0700000204',provider:'MTN'},{name:'Amina Nakato',number:'0770000001',provider:'MTN'},{name:'Sarah Nambasa',number:'0750000002',provider:'Airtel'},{name:'Daniel Kato',number:'0780000003',provider:'MTN'}];
export function recipientOptions(records,key='phone',source='contacts'){
 if(source==='contacts'&&key==='phone')return demoContacts.map(c=>({...c,demo:true}));
 const seen=new Set();return records.slice().reverse().filter(r=>key==='phone'?['airtime','data','voice'].includes(r.kind):key==='accountNumber'?r.kind==='send':r.kind==='electricity').filter(r=>{const identity=(r.recipient||'')+'|'+(key==='accountNumber'?r.provider:'');if(!r.recipient||seen.has(identity))return false;seen.add(identity);return true;}).map(r=>({name:r.accountName||r.recipient,number:r.recipient,provider:r.provider,kind:r.kind}));
}
