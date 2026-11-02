import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { requireStudio } from '@/lib/auth';
export const runtime='nodejs';
export async function POST(request:Request) {
 const denied = await requireStudio(); if (denied) return denied;
 try {
  const form=await request.formData(); const files=form.getAll('files') as File[];
  if(!files.length||files.length>16) return NextResponse.json({error:'Upload between 1 and 16 files at a time.'},{status:400});
  const results=[];
  for(const file of files){
   const video=file.type==='video/mp4'||file.type==='video/webm';
   const image=['image/jpeg','image/png','image/webp'].includes(file.type);
   if(!video&&!image) return NextResponse.json({error:'Use JPG, PNG, WebP, MP4, or WebM files.'},{status:400});
   if(file.size>(video?50:10)*1024*1024) return NextResponse.json({error:`${file.name} exceeds the ${video?'50 MB video':'10 MB photo'} limit.`},{status:400});
   const bytes=Buffer.from(await file.arrayBuffer());
   const folder=video?'videos':'images'; const dir=path.join(process.cwd(),'public','uploads',folder);
   await fs.mkdir(dir,{recursive:true});
   const name=crypto.randomUUID()+(video?(file.type==='video/webm'?'.webm':'.mp4'):'.webp');
   if(video) await fs.writeFile(path.join(dir,name),bytes);
   else { try { await sharp(bytes).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(path.join(dir,name)); } catch { return NextResponse.json({error:'This image could not be read. Please choose a valid photo.'},{status:400}); } }
   results.push({url:`/uploads/${folder}/${name}`,type:video?'video':'image',name:file.name});
  }
  return NextResponse.json({files:results});
 } catch { return NextResponse.json({error:'Upload failed. Please try a smaller file.'},{status:500}); }
}
