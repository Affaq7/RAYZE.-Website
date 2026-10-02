'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Arrow} from '@/components/ui/arrow';
export function Motion(){
 const path=usePathname();
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const seen=new WeakSet<HTMLElement>();
   const animated=new Set<HTMLElement>();
   const triggers:ScrollTrigger[]=[];
   const tweens:gsap.core.Tween[]=[];
   let frame=0;
   const registerText=()=>{
    const selector='h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,label,a,button,span,small,summary,th,td,figcaption,legend,div';
    const candidates=Array.from(document.querySelectorAll<HTMLElement>('main,footer')).flatMap(root=>Array.from(root.querySelectorAll<HTMLElement>(selector))).filter(el=>{
     if(el.closest('[aria-hidden="true"],.marquee,.motion-control,.services-section .service-number,[role="alert"],[role="status"]')) return false;
     if(!Array.from(el.childNodes).some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent?.trim())) return false;
     return !el.matches('div,li,label,a,button')||!el.querySelector('h1,h2,h3,h4,h5,h6,p,li,label');
    });
    const candidateSet=new Set(candidates);
    const fresh=candidates.filter(el=>{
     if(seen.has(el)) return false;
     for(let parent=el.parentElement;parent;parent=parent.parentElement) if(candidateSet.has(parent)) return false;
     seen.add(el);return true;
    });
    fresh.forEach(el=>{el.dataset.textReveal='';animated.add(el);});
    if(!fresh.length)return;
    triggers.push(...ScrollTrigger.batch(fresh,{start:'top 94%',once:true,interval:.08,batchMax:8,onEnter:elements=>{
     // Start only on entry; essential text remains readable before JS runs.
     tweens.push(gsap.fromTo(elements,{y:24},{y:0,duration:.65,stagger:.045,ease:'power3.out',clearProps:'transform'}));
    }}));
    ScrollTrigger.refresh();
   };
   registerText();
   // Include streamed routes, filtered lists and newly inserted admin content.
   const contentObserver=new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(registerText);});
   contentObserver.observe(document.body,{childList:true,subtree:true,characterData:true});
   if(window.innerWidth>700){
    const rows=gsap.utils.toArray<HTMLElement>('.services-section .service-row');
    if(rows.length){const timeline=gsap.timeline({scrollTrigger:{trigger:'.services-section .service-list',start:'top 75%',end:'bottom 35%',scrub:.4}});rows.forEach(row=>timeline.fromTo(row.querySelector('.service-number'),{y:10},{y:0,duration:1}));}
    gsap.utils.toArray<HTMLElement>('.project img').forEach(el=>gsap.fromTo(el,{y:12},{y:-12,scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}));
   }
   return()=>{contentObserver.disconnect();cancelAnimationFrame(frame);triggers.forEach(trigger=>trigger.kill());tweens.forEach(tween=>tween.revert());animated.forEach(el=>delete el.dataset.textReveal);};
  });
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{(entry.target as HTMLElement).dataset.offscreen=String(!entry.isIntersecting);}));
  document.querySelectorAll('.hero-mark img,.marquee-track').forEach(el=>observer.observe(el));
  const visibility=()=>{document.documentElement.dataset.background=String(document.hidden);};visibility();document.addEventListener('visibilitychange',visibility);
  return()=>{mm.revert();observer.disconnect();document.removeEventListener('visibilitychange',visibility);delete document.documentElement.dataset.background;};
 },[path]);return null;
}
export function MotionControl(){const [paused,setPaused]=useState(false);useEffect(()=>{document.documentElement.dataset.motion=paused?'paused':'running';return()=>{delete document.documentElement.dataset.motion;};},[paused]);return <button className="motion-control" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Play motion':'Pause motion'} <span aria-hidden="true">{paused?'▷':'Ⅱ'}</span></button>;}
export function Marquee(){return <div className="marquee" aria-label="Strategy, identity, content, digital"><div className="marquee-track">{[0,1].map(n=><span key={n} aria-hidden={n===1}>STRATEGY <i><Arrow diagonal/></i> IDENTITY <i><Arrow diagonal/></i> CONTENT <i><Arrow diagonal/></i> DIGITAL <i><Arrow diagonal/></i> </span>)}</div></div>;}
