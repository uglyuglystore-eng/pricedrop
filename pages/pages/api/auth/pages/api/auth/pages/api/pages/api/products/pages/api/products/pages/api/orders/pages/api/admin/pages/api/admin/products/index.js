import{supabaseAdmin}from'../../../../lib/supabase'
import{requireAdmin}from'../../../../lib/auth'
export const config={api:{bodyParser:{sizeLimit:'10mb'}}}
async function handler(req,res){
const db=supabaseAdmin()
if(req.method==='GET'){
const{page=1,limit=20,search,status}=req.query
let q=db.from('products').select('*,categories(name,emoji)',{count:'exact'})
if(search)q=q.ilike('name',`%${search}%`)
if(status)q=q.eq('status',status)
q=q.order('created_at',{ascending:false})
const from=(Number(page)-1)*Number(limit)
q=q.range(from,from+Number(limit)-1)
const{data,error,count}=await q
if(error)return res.status(400).json({error:error.message})
return res.status(200).json({products:data||[],total:count})}
if(req.method==='POST'){
const body={...req.body}
if(!body.slug&&body.name){const base=body.name.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');body.slug=`${base}-${Date.now()}`}
if(body.images&&body.images.length>0&&!body.thumbnail){body.thumbnail=body.images[0]}
const{data,error}=await db.from('products').insert([body]).select().single()
if(error)return res.status(400).json({error:error.message})
return res.status(201).json(data)}
res.status(405).end()}
export default requireAdmin(handler)
