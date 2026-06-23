import{supabase}from'../../../lib/supabase'
export default async function handler(req,res){
if(req.method!=='GET')return res.status(405).end()
const{id}=req.query
try{
const{data,error}=await supabase.from('products').select('*,categories(name,slug,emoji),product_variants(*)').eq(id.length===36&&id.includes('-')?'id':'slug',id).single()
if(error||!data)return res.status(404).json({error:'Producto no encontrado'})
res.setHeader('Cache-Control','s-maxage=120,stale-while-revalidate')
res.status(200).json(data)
}catch(err){res.status(500).json({error:err.message})}}
