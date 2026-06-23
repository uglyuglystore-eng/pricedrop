import{useState,useEffect,useCallback}from'react'
import Head from'next/head'
function Login({onLogin}){
const[user,setUser]=useState('')
const[pass,setPass]=useState('')
const[err,setErr]=useState('')
const[loading,setLoading]=useState(false)
const submit=async()=>{
if(!user||!pass)return setErr('Completa todos los campos')
setLoading(true);setErr('')
const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,password:pass})})
const data=await res.json()
setLoading(false)
if(!res.ok)return setErr(data.error||'Error')
localStorage.setItem('pd_admin_token',data.token)
onLogin(data.token)}
return(<div style={{minHeight:'100vh',background:'linear-gradient(135deg,#B91C1C,#E52222)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
<div style={{background:'white',borderRadius:24,padding:'36px 28px',width:'100%',maxWidth:380,textAlign:'center'}}>
<div style={{fontSize:52,marginBottom:12}}>🔥</div>
<h1 style={{fontSize:24,fontWeight:900,color:'#E52222',marginBottom:4}}>Price Drop</h1>
<p style={{fontSize:14,color:'#6B7280',marginBottom:28}}>Panel de Administración</p>
{err&&<div style={{background:'#FEE2E2',color:'#B91C1C',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13}}>{err}</div>}
<input value={user} onChange={e=>setUser(e.target.value)} placeholder="Usuario" style={{width:'100%',padding:'12px 16px',border:'2px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',marginBottom:12,boxSizing:'border-box'}}/>
<input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Contraseña" style={{width:'100%',padding:'12px 16px',border:'2px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',marginBottom:20,boxSizing:'border-box'}}/>
<button onClick={submit} disabled={loading} style={{width:'100%',padding:'14px 0',background:loading?'#9CA3AF':'linear-gradient(135deg,#E52222,#B91C1C)',color:'white',border:'none',borderRadius:12,fontWeight:800,fontSize:16,cursor:loading?'not-allowed':'pointer'}}>
{loading?'⏳ Entrando...':'🔐 Entrar'}</button>
<a href="/" style={{display:'block',marginTop:16,color:'#6B7280',fontSize:13}}>← Volver a la tienda</a>
</div></div>)}
const EMPTY={name:'',short_desc:'',description:'',category_id:'',price:'',compare_price:'',cost_price:'',stock:'',sku:'',badge:'',hot:false,featured:false,status:'active',images:[],variants:[]}
function ProductForm({initial=EMPTY,categories,onSave,onCancel,token}){
const[form,setForm]=useState({...EMPTY,...initial})
const[saving,setSaving]=useState(false)
const[err,setErr]=useState('')
const[varInput,setVarInput]=useState('')
const isEdit=!!initial.id
const set=(k,v)=>setForm(f=>({...f,[k]:v}))
const addVariant=()=>{
if(!varInput.trim())return
const[label,...opts]=varInput.split(':')
if(!label||!opts.length)return
const options=opts[0].split(',').map(s=>s.trim()).filter(Boolean)
set('variants',[...(form.variants||[]),{label:label.trim(),options}])
setVarInput('')}
const save=async()=>{
if(!form.name||!form.price)return setErr('Nombre y precio requeridos')
setSaving(true);setErr('')
const body={...form,price:Number(form.price),compare_price:form.compare_price?Number(form.compare_price):null,cost_price:form.cost_price?Number(form.cost_price):null,stock:Number(form.stock)||0}
const url=isEdit?`/api/admin/products/${initial.id}`:'/api/admin/products'
const method=isEdit?'PUT':'POST'
const res=await fetch(url,{method,headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(body)})
const data=await res.json()
setSaving(false)
if(!res.ok)return setErr(data.error)
onSave(data)}
return(<div style={{padding:16,overflowY:'auto',flex:1}}>
{err&&<div style={{background:'#FEE2E2',color:'#B91C1C',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13}}>{err}</div>}
<div style={{background:'white',borderRadius:14,padding:16,marginBottom:14,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{fontWeight:800,fontSize:14,marginBottom:14,color:'#E52222'}}>📋 Información básica</div>
{[['Nombre *','name'],['Descripción corta','short_desc'],['SKU','sku'],['Badge','badge']].map(([l,k])=><div key={k} style={{marginBottom:12}}>
<label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:4}}>{l}</label>
<input value={form[k]||''} onChange={e=>set(k,e.target.value)} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}}/>
</div>)}
<div style={{marginBottom:12}}>
<label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:4}}>Descripción completa</label>
<textarea value={form.description||''} onChange={e=>set('description',e.target.value)} rows={3} style={{width:'100%',padding:'10px 14px',
