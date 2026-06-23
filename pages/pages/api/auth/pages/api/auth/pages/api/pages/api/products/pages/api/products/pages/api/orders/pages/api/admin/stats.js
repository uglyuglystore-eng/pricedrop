import{supabaseAdmin}from'../../../lib/supabase'
import{requireAdmin}from'../../../lib/auth'
async function handler(req,res){
if(req.method!=='GET')return res.status(405).end()
const db=supabaseAdmin()
const[products,orders,revenue]=await Promise.all([
db.from('products').select('id',{count:'exact',head:true}).eq('status','active'),
db.from('orders').select('id,total,status',{count:'exact'}),
db.from('orders').select('total').eq('payment_status','paid')
])
const totalRevenue=(revenue.data||[]).reduce((s,o)=>s+Number(o.total),0)
const pendingOrders=(orders.data||[]).filter(o=>o.status==='pending').length
res.status(200).json({products:products.count||0,orders:orders.count||0,revenue:totalRevenue,pending:pendingOrders})}
export default requireAdmin(handler)
