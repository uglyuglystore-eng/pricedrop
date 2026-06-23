import{supabase}from'../../../lib/supabase'
export default async function handler(req,res){
if(req.method!=='GET')return res.status(405).end()
const{category,search,page=1,limit=24,sort='sold_count',featured,hot}=req.query
try{
let q=supabase.from('products').select('*,categories(name,slug,emoji)',{count:'exact'}).eq('status','active')
if(category&&category!=='all'){const{data:cat}=await supabase.from('categories').select('id').eq('slug',category).single();if(cat)q=q.eq('category_id',cat.id)}
if(search)q=q.ilike('name',`%${search}%`)
if(featured)q=q.eq('featured',true)
if(hot)q=q.eq('hot',true)
switch(sort){case'price_asc':q=q.order('price',{ascending:true});break;case'price_desc':q=q.order('price',{ascending:false});break;case'newest':q=q.order('created_at',{ascending:false});break;default:q=q.order('sold_count',{ascending:false});break}
const from=(Number(page)-1)*Number(limit)
q=q.range(from,from+Number(limit)-1)
const{data,error,count}=await q
if(error)throw error
res.setHeader('Cache-Control','s-maxage=60,stale-while-revalidate')
res.status(200).json({products:data||[],total:count,page:Number(page),limit:Number(limit)})
}catch(err){res.status(500).json({error:err.message})}}
