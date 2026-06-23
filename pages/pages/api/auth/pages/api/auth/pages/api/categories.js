import{supabase}from'../../lib/supabase'
export default async function handler(req,res){
const{data,error}=await supabase.from('categories').select('*').eq('active',true).order('sort_order')
if(error)return res.status(500).json({error:error.message})
res.setHeader('Cache-Control','s-maxage=300,stale-while-revalidate')
res.status(200).json(data||[])}
