import {drawStatement,drawReceipt,drawAccount,statementName} from './statement-layout.mjs';
const cache=new Map();
export async function createPdf(data){const key=JSON.stringify(data);if(cache.has(key))return cache.get(key);const fontBytes=await fetch(new URL('./assets/PlusJakartaSans.ttf',import.meta.url)).then(r=>r.arrayBuffer());const bytes=await drawStatement(window.PDFLib,window.fontkit,fontBytes,data);const result={bytes,uri:URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),filename:statementName(data)};cache.set(key,result);return result;}
export function downloadPdf(pdf){const a=document.createElement('a');a.href=pdf.uri;a.download=pdf.filename;a.click();}
export async function createReceiptPdf(record){const fontBytes=await fetch(new URL('./assets/PlusJakartaSans.ttf',import.meta.url)).then(r=>r.arrayBuffer());const bytes=await drawReceipt(window.PDFLib,window.fontkit,fontBytes,record);return {bytes,uri:URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),filename:'Nsimbi-receipt-'+record.reference+'.pdf'};}

export async function createAccountPdf(data){const fontBytes=await fetch(new URL('./assets/PlusJakartaSans.ttf',import.meta.url)).then(r=>r.arrayBuffer());return {bytes:await drawAccount(window.PDFLib,window.fontkit,fontBytes,data),filename:'Nsimbi-account-details.pdf'};}
