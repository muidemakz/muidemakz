import {BANKS} from './model.mjs';
export const BENEFICIARY_STORE='nsimbi-beneficiaries-v1';
export function restoreBeneficiaries(raw){try{const rows=JSON.parse(raw);return Array.isArray(rows)?rows.filter(r=>r&&typeof r.bank==='string'&&/^\d{10}$/.test(r.account)&&typeof r.name==='string').slice(0,50):[];}catch{return [];}}
export function transferRecipients(records,saved=[],tab='recent',query=''){const seen=new Set(),q=query.trim().toLowerCase();const rows=tab==='saved'?saved:records.slice().reverse().filter(r=>r.kind==='send').map(r=>({name:r.accountName||'Bank account',account:r.recipient,bank:r.provider}));return rows.filter(r=>{const key=r.bank+'|'+r.account;if(seen.has(key))return false;seen.add(key);return !q||(r.name+' '+r.account+' '+r.bank).toLowerCase().includes(q);});}
export function saveBeneficiary(rows,recipient){return [{name:recipient.name,account:recipient.account,bank:recipient.bank},...rows.filter(r=>r.account!==recipient.account||r.bank!==recipient.bank)].slice(0,50);}

export function recentBanks(records){return [...new Set(records.slice().reverse().filter(r=>r.kind==='send'&&BANKS.includes(r.provider)).map(r=>r.provider))];}
