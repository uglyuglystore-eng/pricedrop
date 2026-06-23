import{supabaseAdmin}from'../../../lib/supabase'
import{comparePassword,signToken,setAuthCookie}from'../../../lib/auth'
export default async function handler(req,res){
if(req.method!=='POST')return res.status(405).end()
const{username,password}=req.body
if(!username||!password)return res.status(400).json({error:'Usuario y contraseña requeridos'})
try{
const envUser=process.env.ADMIN_USERNAME||'admin'
const envPass=process.env.ADMIN_PASSWORD||'admin123'
let valid=false
if(username===envUser&&password===envPass){valid=true}
else{const db=supabaseAdmin();const{data:user}=await db.from('admin_users').select('*').eq('username',username).single();if(user&&comparePassword(password,user.password_hash)){valid=true}}
if(!valid)return res.status(401).json({error:'Usuario o contraseña incorrectos'})
const token=signToken({username,role:'admin'})
setAuthCookie(res,token)
res.status(200).json({success:true,token})
}catch(err){res.status(500).json({error:err.message})}}
