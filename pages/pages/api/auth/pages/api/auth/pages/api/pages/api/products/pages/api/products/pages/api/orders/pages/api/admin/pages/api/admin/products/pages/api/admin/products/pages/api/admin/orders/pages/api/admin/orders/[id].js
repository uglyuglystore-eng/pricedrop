import{supabaseAdmin}from'../../../../lib/supabase'
import{requireAdmin}from'../../../../lib/auth'
async function handler(req,res){
const db=supabaseAdmin()
const{id}=req.query
if(req.method==='PUT'){
const{data,error}=await db.from('orders').update(req.body).eq('id',id).select().single()
if(error)return res.status(400).json({error:error.message})
return res.status(200).json(data)}
if(req.method==='DELETE'){
const{error}=await db.from('orders').delete().eq('id',id)
if(error)return res.status(400).json({error:error.message})
return res.status(200).json({success:true})}
res.status(405).end()}
export default requireAdmin(handler)
