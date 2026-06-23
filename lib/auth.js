import jwt from'jsonwebtoken'
import bcrypt from'bcryptjs'
import{serialize,parse}from'cookie'
const JWT_SECRET=process.env.JWT_SECRET||'dev-secret'
const COOKIE_NAME='pd_admin_token'
export function signToken(payload){return jwt.sign(payload,JWT_SECRET,{expiresIn:'24h'})}
export function verifyToken(token){try{return jwt.verify(token,JWT_SECRET)}catch{return null}}
export function comparePassword(password,hash){return bcrypt.compareSync(password,hash)}
export function setAuthCookie(res,token){res.setHeader('Set-Cookie',serialize(COOKIE_NAME,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:86400,path:'/'}))}
export function clearAuthCookie(res){res.setHeader('Set-Cookie',serialize(COOKIE_NAME,'',{maxAge:-1,path:'/'}))}
export function getTokenFromRequest(req){const cookies=parse(req.headers.cookie||'');if(cookies[COOKIE_NAME])return cookies[COOKIE_NAME];const auth=req.headers['authorization']||req.headers['x-admin-token'];if(auth)return auth.replace('Bearer ','');return null}
export function requireAdmin(handler){return async(req,res)=>{const token=getTokenFromRequest(req);if(!token)return res.status(401).json({error:'No autorizado'});const payload=verifyToken(token);if(!payload)return res.status(401).json({error:'Token inválido'});req.admin=payload;return handler(req,res)}}
