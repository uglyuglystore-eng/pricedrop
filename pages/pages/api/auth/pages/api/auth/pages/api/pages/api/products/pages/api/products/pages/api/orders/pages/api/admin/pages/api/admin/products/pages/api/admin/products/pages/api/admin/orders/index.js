import{supabaseAdmin}from'../../../../lib/supabase'
import{requireAdmin}from'../../../../lib/auth'
async function handler(req,res){
const db=supabaseAdmin()
if(req.method==='GET'){
const{page=1,limit=20,status,search}=req.query
let q=db.from('orders').select('*,customers(name,email,phone)',{count:'exact'})
if(status)q=q.eq('status',status)
if(search)q=q.or(`order_number.ilike.%${search}%,shipping_name.ilike.%${search}%`)
q=q.order('created_at',{ascending:false})
const from=(Number(page)-1)*Number(limit)
q=q.range(from,from+Number(limit)-1)
const{data,error,count}=await q
if(error)return res.status(400).json({error:error.message})
return res.status(200).json({orders:data||[],total:count})}
res.status(405).end()}
export default requireAdmin(handler)
