import{supabaseAdmin,deleteProductImage}from'../../../../lib/supabase'
import{requireAdmin}from'../../../../lib/auth'
async function handler(req,res){
const db=supabaseAdmin()
const{id}=req.query
if(req.method==='PUT'){
const body={...req.body}
if(body.images&&body.images.length>0)body.thumbnail=body.images[0]
const{data,error}=await db.from('products').update(body).eq('id',id).select().single()
if(error)return res.status(400).json({error:error.message})
return res.status(200).json(data)}
if(req.method==='DELETE'){
const{data:prod}=await db.from('products').select('images').eq('id',id).single()
if(prod?.images){for(const url of prod.images){try{await deleteProductImage(url)}catch(e){}}}
await db.from('product_variants').delete().eq('product_id',id)
const{error}=await db.from('products').delete().eq('id',id)
if(error)return res.status(400).json({error:error.message})
return res.status(200).json({success:true})}
res.status(405).end()}
export default requireAdmin(handler)
