import{supabaseAdmin}from'../../../lib/supabase'
export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).end()
const db=supabaseAdmin()
const{customer,items,shipping_address,payment_method,notes,source}=req.body
if(!items||items.length===0)return res.status(400).json({error:'No hay productos'})
try{
let customer_id=null
if(customer?.email){const{data:existing}=await db.from('customers').select('id').eq('email',customer.email).single();if(existing){customer_id=existing.id}else{const{data:newC}=await db.from('customers').insert([customer]).select('id').single();customer_id=newC?.id}}
const subtotal=items.reduce((s,i)=>s+(i.price*i.qty),0)
const shipping=subtotal>=49?0:4.99
const total=subtotal+shipping
const order_number=`PD-${Date.now().toString(36).toUpperCase()}`
const{data,error}=await db.from('orders').insert([{order_number,customer_id,items,subtotal,shipping,total,payment_method,shipping_name:customer?.name,shipping_address,notes,source:source||'web'}]).select().single()
if(error)throw error
res.status(201).json({success:true,order_number,order:data})
}catch(err){res.status(500).json({error:err.message})}}
