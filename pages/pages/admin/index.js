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
<textarea value={form.description||''} onChange={e=>set('description',e.target.value)} rows={3} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
</div>
<div style={{marginBottom:12}}>
<label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:4}}>Categoría</label>
<select value={form.category_id||''} onChange={e=>set('category_id',e.target.value)} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',background:'white',boxSizing:'border-box'}}>
<option value="">Sin categoría</option>
{categories.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
</select>
</div>
<div style={{marginBottom:12}}>
<label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:4}}>Estado</label>
<select value={form.status} onChange={e=>set('status',e.target.value)} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',background:'white',boxSizing:'border-box'}}>
<option value="active">✅ Activo</option>
<option value="draft">📝 Borrador</option>
<option value="archived">📦 Archivado</option>
</select>
</div>
</div>
<div style={{background:'white',borderRadius:14,padding:16,marginBottom:14,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{fontWeight:800,fontSize:14,marginBottom:14,color:'#E52222'}}>💰 Precios e inventario</div>
{[['Precio rebajado *','price'],['Precio original','compare_price'],['Costo interno','cost_price'],['Stock','stock']].map(([l,k])=><div key={k} style={{marginBottom:12}}>
<label style={{fontSize:12,fontWeight:700,color:'#374151',display:'block',marginBottom:4}}>{l}</label>
<input type="number" step="0.01" min="0" value={form[k]||''} onChange={e=>set(k,e.target.value)} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}}/>
</div>)}
{form.price&&form.compare_price&&<div style={{background:'#FEE2E2',borderRadius:10,padding:'8px 12px',fontSize:13,color:'#B91C1C',fontWeight:700}}>
💥 Descuento: {Math.round((1-form.price/form.compare_price)*100)}%</div>}
</div>
<div style={{background:'white',borderRadius:14,padding:16,marginBottom:14,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{fontWeight:800,fontSize:14,marginBottom:14,color:'#E52222'}}>📸 Fotos (URLs)</div>
<div style={{fontSize:12,color:'#6B7280',marginBottom:8}}>Agrega URLs de fotos — una por línea. Orden: Frontal, Lateral, Interior, Detalle, Medidas, Uso Real</div>
<textarea value={(form.images||[]).join('\n')} onChange={e=>set('images',e.target.value.split('\n').map(s=>s.trim()).filter(Boolean))} rows={6} placeholder={"https://ejemplo.com/foto1.jpg\nhttps://ejemplo.com/foto2.jpg"} style={{width:'100%',padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:13,outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
</div>
<div style={{background:'white',borderRadius:14,padding:16,marginBottom:14,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{fontWeight:800,fontSize:14,marginBottom:14,color:'#E52222'}}>🎨 Variantes</div>
<div style={{fontSize:12,color:'#6B7280',marginBottom:8}}>Formato: Color: Rojo, Azul, Verde</div>
<div style={{display:'flex',gap:8}}>
<input value={varInput} onChange={e=>setVarInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addVariant()} placeholder="Color: Rojo, Azul" style={{flex:1,padding:'9px 14px',border:'1px solid #E5E7EB',borderRadius:10,fontSize:13,outline:'none'}}/>
<button onClick={addVariant} style={{padding:'9px 16px',background:'#E52222',color:'white',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer'}}>+</button>
</div>
{(form.variants||[]).map((v,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8,marginTop:8,background:'#F9FAFB',borderRadius:8,padding:'8px 12px'}}>
<span style={{flex:1,fontSize:13,fontWeight:600}}>{v.label}: {v.options.join(', ')}</span>
<button onClick={()=>set('variants',form.variants.filter((_,j)=>j!==i))} style={{background:'#FEE2E2',color:'#E52222',border:'none',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontSize:12}}>✕</button>
</div>)}
</div>
<div style={{display:'flex',gap:16,marginBottom:20}}>
{[['hot','🔥 HOT'],['featured','⭐ Destacado']].map(([k,l])=><label key={k} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,fontWeight:600}}>
<input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{width:16,height:16,accentColor:'#E52222'}}/>{l}
</label>)}
</div>
<div style={{display:'flex',gap:10}}>
<button onClick={save} disabled={saving} style={{flex:1,padding:'15px 0',background:saving?'#9CA3AF':'linear-gradient(135deg,#E52222,#B91C1C)',color:'white',border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:saving?'not-allowed':'pointer'}}>
{saving?'⏳ Guardando...':isEdit?'💾 Guardar':'✅ Crear'}</button>
<button onClick={onCancel} style={{padding:'15px 20px',background:'#F3F4F6',color:'#374151',border:'none',borderRadius:14,fontWeight:700,fontSize:15,cursor:'pointer'}}>Cancelar</button>
</div></div>)}
export default function Admin(){
const[token,setToken]=useState(null)
const[tab,setTab]=useState('dashboard')
const[products,setProducts]=useState([])
const[orders,setOrders]=useState([])
const[categories,setCats]=useState([])
const[stats,setStats]=useState({})
const[editing,setEditing]=useState(null)
const[search,setSearch]=useState('')
const[total,setTotal]=useState(0)
const[msg,setMsg]=useState({text:'',type:'success'})
useEffect(()=>{const t=localStorage.getItem('pd_admin_token');if(t)setToken(t)},[])
const flash=(text,type='success')=>{setMsg({text,type});setTimeout(()=>setMsg({text:'',type:'success'}),3500)}
const api=useCallback(async(url,opts={})=>{
const res=await fetch(url,{headers:{'Content-Type':'application/json','x-admin-token':token},...opts})
const data=await res.json()
if(!res.ok)throw new Error(data.error||'Error')
return data},[token])
useEffect(()=>{
if(!token)return
fetch('/api/categories').then(r=>r.json()).then(setCats)
api('/api/admin/stats').then(setStats).catch(()=>{})
api('/api/admin/products?limit=100').then(d=>{setProducts(d.products||[]);setTotal(d.total||0)}).catch(()=>{})
api('/api/admin/orders?limit=50').then(d=>setOrders(d.orders||[])).catch(()=>{})},[token,api])
if(!token)return<Login onLogin={t=>setToken(t)}/>
const logout=async()=>{await fetch('/api/auth/logout',{method:'POST'});localStorage.removeItem('pd_admin_token');setToken(null)}
const deleteProduct=async(id)=>{
if(!confirm('¿Eliminar?'))return
try{await api(`/api/admin/products/${id}`,{method:'DELETE'});setProducts(prev=>prev.filter(p=>p.id!==id));flash('🗑️ Eliminado')}
catch(e){flash(e.message,'error')}}
const updateOrder=async(id,body)=>{
try{const data=await api(`/api/admin/orders/${id}`,{method:'PUT',body:JSON.stringify(body)});setOrders(prev=>prev.map(o=>o.id===id?data:o));flash('✅ Actualizado')}
catch(e){flash(e.message,'error')}}
const STATUS_COLORS={pending:'#F59E0B',confirmed:'#3B82F6',processing:'#8B5CF6',shipped:'#06B6D4',delivered:'#10B981',cancelled:'#EF4444',refunded:'#6B7280'}
const STATUS_ES={pending:'Pendiente',confirmed:'Confirmado',processing:'Procesando',shipped:'Enviado',delivered:'Entregado',cancelled:'Cancelado',refunded:'Reembolsado'}
const filtered=products.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()))
return(<>
<Head><title>Admin — Price Drop</title></Head>
<div style={{fontFamily:'system-ui,sans-serif',background:'#F8F9FA',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
<nav style={{background:'#111827',padding:'0 16px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200}}>
<div style={{display:'flex',alignItems:'center',gap:8}}>
<span style={{fontSize:20}}>🔥</span>
<span style={{color:'white',fontWeight:900,fontSize:16}}>Price Drop Admin</span>
</div>
<div style={{display:'flex',gap:8}}>
<a href="/" target="_blank" style={{background:'rgba(255,255,255,0.1)',color:'white',textDecoration:'none',borderRadius:20,padding:'5px 12px',fontSize:12,fontWeight:600}}>🛍️ Ver tienda</a>
<button onClick={logout} style={{background:'#E52222',color:'white',border:'none',borderRadius:20,padding:'5px 12px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Salir</button>
</div></nav>
{msg.text&&<div style={{background:msg.type==='error'?'#FEE2E2':'#D1FAE5',padding:'10px 20px',textAlign:'center',fontWeight:700,fontSize:14,color:msg.type==='error'?'#B91C1C':'#065F46'}}>{msg.text}</div>}
<div style={{background:'white',display:'flex',gap:0,borderBottom:'1px solid #E5E7EB',overflowX:'auto',position:'sticky',top:52,zIndex:190}}>
{[['dashboard','📊 Dashboard'],['products','📦 Productos'],['orders','🧾 Pedidos'],['add','➕ Nuevo']].map(([k,l])=><button key={k} onClick={()=>{setTab(k);if(k!=='add')setEditing(null)}} style={{padding:'14px 16px',border:'none',borderBottom:tab===k?'3px solid #E52222':'3px solid transparent',background:'white',color:tab===k?'#E52222':'#6B7280',fontWeight:700,fontSize:13,cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}>{l}</button>)}
</div>
<div style={{flex:1,display:'flex',flexDirection:'column'}}>
{tab==='dashboard'&&<div style={{padding:'16px 14px 32px'}}>
<div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:16}}>
{[['📦',stats.products||0,'Productos'],['🧾',stats.orders||0,'Pedidos'],['⏳',stats.pending||0,'Pendientes'],['💰',`$${(stats.revenue||0).toFixed(0)}','Ingresos`]].map(([ic,val,lab])=><div key={lab} style={{background:'white',borderRadius:14,padding:16,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',textAlign:'center',borderTop:'3px solid #E52222'}}>
<div style={{fontSize:24}}>{ic}</div>
<div style={{fontSize:22,fontWeight:900,color:'#E52222',marginTop:4}}>{val}</div>
<div style={{fontSize:12,color:'#6B7280',marginTop:2}}>{lab}</div>
</div>)}
</div>
<div style={{background:'white',borderRadius:14,padding:16,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🧾 Últimos pedidos</div>
{orders.slice(0,5).map(o=><div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #F3F4F6'}}>
<div><div style={{fontWeight:700,fontSize:13}}>{o.order_number}</div><div style={{fontSize:12,color:'#6B7280'}}>{o.shipping_name||'Cliente'}</div></div>
<div style={{textAlign:'right'}}>
<div style={{fontWeight:800,color:'#E52222'}}>${Number(o.total).toFixed(2)}</div>
<span style={{background:STATUS_COLORS[o.status]+'22',color:STATUS_COLORS[o.status],borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:700}}>{STATUS_ES[o.status]}</span>
</div></div>)}
</div></div>}
{tab==='products'&&!editing&&<div style={{padding:'12px 14px 32px'}}>
<div style={{display:'flex',gap:8,marginBottom:12}}>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar..." style={{flex:1,padding:'10px 14px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:14,outline:'none',background:'white'}}/>
<button onClick={()=>setTab('add')} style={{background:'#E52222',color:'white',border:'none',borderRadius:12,padding:'10px 16px',fontWeight:800,fontSize:14,cursor:'pointer',flexShrink:0}}>+ Nuevo</button>
</div>
<div style={{fontSize:12,color:'#6B7280',marginBottom:10}}>{total} productos</div>
{filtered.map(p=><div key={p.id} style={{background:'white',borderRadius:12,padding:'12px 14px',marginBottom:10,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',gap:12,alignItems:'center'}}>
<div style={{width:52,height:52,borderRadius:10,overflow:'hidden',flexShrink:0,background:'#F3F4F6'}}>
{p.thumbnail?<img src={p.thumbnail} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>{p.categories?.emoji||'📦'}</div>}
</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontWeight:800,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
<div style={{fontSize:12,color:'#6B7280'}}>{p.categories?.name||'Sin categoría'} · Stock: {p.stock}</div>
<div style={{display:'flex',gap:8,alignItems:'center',marginTop:3}}>
<span style={{fontSize:15,fontWeight:900,color:'#E52222'}}>${Number(p.price).toFixed(2)}</span>
{p.compare_price&&<span style={{fontSize:12,color:'#9CA3AF',textDecoration:'line-through'}}>${Number(p.compare_price).toFixed(2)}</span>}
</div></div>
<div style={{display:'flex',flexDirection:'column',gap:5,flexShrink:0}}>
<button onClick={()=>{setEditing(p);setTab('edit')}} style={{background:'#EFF6FF',color:'#1877F2',border:'none',borderRadius:8,padding:'6px 12px',fontWeight:700,fontSize:12,cursor:'pointer'}}>✏️</button>
<button onClick={()=>deleteProduct(p.id)} style={{background:'#FEE2E2',color:'#E52222',border:'none',borderRadius:8,padding:'6px 12px',fontWeight:700,fontSize:12,cursor:'pointer'}}>🗑️</button>
</div></div>)}
</div>}
{(tab==='add'||tab==='edit')&&<ProductForm initial={tab==='edit'?editing:EMPTY} categories={categories} token={token}
onSave={(data)=>{if(tab==='edit')setProducts(prev=>prev.map(p=>p.id===data.id?data:p));else setProducts(prev=>[data,...prev]);flash(`✅ Producto ${tab==='edit'?'actualizado':'creado'}`);setTab('products');setEditing(null)}}
onCancel={()=>{setTab('products');setEditing(null)}}/>}
{tab==='orders'&&<div style={{padding:'12px 14px 32px'}}>
{orders.map(o=><div key={o.id} style={{background:'white',borderRadius:12,padding:14,marginBottom:10,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
<div><div style={{fontWeight:900,fontSize:15}}>{o.order_number}</div><div style={{fontSize:12,color:'#6B7280'}}>{o.shipping_name} · {new Date(o.created_at).toLocaleDateString('es')}</div></div>
<div style={{fontWeight:900,color:'#E52222',fontSize:16}}>${Number(o.total).toFixed(2)}</div>
</div>
<div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
<select value={o.status} onChange={e=>updateOrder(o.id,{status:e.target.value})} style={{padding:'6px 10px',border:`2px solid ${STATUS_COLORS[o.status]}`,borderRadius:8,fontWeight:700,fontSize:12,color:STATUS_COLORS[o.status],background:STATUS_COLORS[o.status]+'15',outline:'none',cursor:'pointer'}}>
{Object.entries(STATUS_ES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
</select>
<select value={o.payment_status} onChange={e=>updateOrder(o.id,{payment_status:e.target.value})} style={{padding:'6px 10px',border:'1px solid #E5E7EB',borderRadius:8,fontSize:12,outline:'none',cursor:'pointer',background:'white'}}>
<option value="unpaid">💸 No pagado</option>
<option value="paid">✅ Pagado</option>
<option value="refunded">↩️ Reembolsado</option>
</select>
</div></div>)}
</div>}
</div></div></>)}
