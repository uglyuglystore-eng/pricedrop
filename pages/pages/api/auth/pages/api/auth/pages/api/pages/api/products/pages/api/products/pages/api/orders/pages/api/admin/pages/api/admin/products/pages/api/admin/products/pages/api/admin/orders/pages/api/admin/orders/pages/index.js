import{useState,useEffect,useCallback,useRef}from'react'
import Head from'next/head'
function ImageGallery({images=[],name}){
const[idx,setIdx]=useState(0)
const startX=useRef(0)
const LABELS=['FRONTAL','LATERAL','INTERIOR','DETALLE','MEDIDAS','USO REAL']
const imgs=images.length>0?images:[null]
const prev=()=>setIdx(i=>(i-1+imgs.length)%imgs.length)
const next=()=>setIdx(i=>(i+1)%imgs.length)
return(<div style={{position:'relative',userSelect:'none'}}>
<div onTouchStart={e=>{startX.current=e.touches[0].clientX}} onTouchEnd={e=>{const diff=startX.current-e.changedTouches[0].clientX;if(Math.abs(diff)>40)diff>0?next():prev()}} style={{width:'100%',aspectRatio:'1/1',position:'relative',overflow:'hidden',background:'#F3F4F6'}}>
{imgs[idx]?<img src={imgs[idx]} alt={`${name}-${idx}`} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#F3F4F6,#E5E7EB'}}><span style={{fontSize:64}}>📦</span></div>}
{imgs.length>1&&<div style={{position:'absolute',bottom:10,left:10,background:'rgba(0,0,0,0.5)',color:'white',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:700}}>{LABELS[idx]||`FOTO ${idx+1}`}</div>}
{imgs.length>1&&<div style={{position:'absolute',bottom:10,right:10,background:'rgba(0,0,0,0.5)',color:'white',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:700}}>{idx+1}/{imgs.length}</div>}
{imgs.length>1&&<><button onClick={prev} style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',fontSize:16}}>‹</button><button onClick={next} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',fontSize:16}}>›</button></>}
</div>
{imgs.length>1&&<div style={{display:'flex',gap:6,padding:'8px 12px',overflowX:'auto',background:'white'}}>
{imgs.map((url,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:56,height:56,flexShrink:0,borderRadius:8,overflow:'hidden',border:idx===i?'2px solid #E52222':'2px solid #E5E7EB',cursor:'pointer',background:'#F3F4F6'}}>
{url?<img src={url} alt={LABELS[i]} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>📦</div>}
</div>)}
</div>}
</div>)}
function Modal({product:p,onClose,onAdd,inCart}){
const[qty,setQty]=useState(1)
const[selVar,setSelVar]=useState({})
const disc=p.compare_price?Math.round((1-p.price/p.compare_price)*100):0
useEffect(()=>{document.body.style.overflow='hidden';return()=>{document.body.style.overflow=''}},[])
return(<div onClick={onClose} style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'flex-end',backdropFilter:'blur(4px)'}}>
<div onClick={e=>e.stopPropagation()} style={{background:'white',width:'100%',maxHeight:'94vh',borderRadius:'20px 20px 0 0',overflowY:'auto',animation:'slideUp .3s ease'}}>
<div style={{position:'sticky',top:0,zIndex:10,display:'flex',justifyContent:'flex-end',padding:'12px 16px 0',background:'white'}}>
<button onClick={onClose} style={{background:'#F3F4F6',border:'none',borderRadius:'50%',width:36,height:36,cursor:'pointer',fontSize:18}}>✕</button></div>
<ImageGallery images={p.images||[]} name={p.name}/>
<div style={{padding:'16px 16px 32px'}}>
<div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
{p.badge&&<span style={{background:p.badge.includes('🔥')?'#FF4500':p.badge.includes('⚡')?'#1877F2':'#10B981',color:'white',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:800}}>{p.badge}</span>}
{disc>0&&<span style={{background:'#FEE2E2',color:'#E52222',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:800}}>-{disc}% DESCUENTO</span>}
{p.stock<=5&&p.stock>0&&<span style
