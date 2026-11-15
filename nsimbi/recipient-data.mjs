// Clearly labelled fixtures. No access to the device address book.
export const demoContacts=[{name:'Tunde Adeyemi',number:'08030000204',provider:'MTN'},{name:'Amina Bello',number:'08060000001',provider:'MTN'},{name:'Ngozi Eze',number:'08020000002',provider:'Airtel'},{name:'Emeka Obi',number:'08130000003',provider:'MTN'}];
export function recipientOptions(records,key='phone',source='contacts'){
 if(source==='contacts'&&key==='phone')return demoContacts.map(c=>({...c,demo:true}));
 const seen=new Set();return records.slice().reverse().filter(r=>key==='phone'?['airtime','data','voice'].includes(r.kind):key==='accountNumber'?r.kind==='send':r.kind==='electricity').filter(r=>{const identity=(r.recipient||'')+'|'+(key==='accountNumber'?r.provider:'');if(!r.recipient||seen.has(identity))return false;seen.add(identity);return true;}).map(r=>({name:r.accountName||r.recipient,number:r.recipient,provider:r.provider,kind:r.kind}));
}
