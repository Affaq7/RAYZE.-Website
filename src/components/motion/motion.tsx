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
   if(document.querySelector('.hero h1')) gsap.from('.hero h1',{y:30,duration:.85,ease:'power3.out'});
   gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{y:24,duration:.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
   if(window.innerWidth>700){
    const rows=gsap.utils.toArray<HTMLElement>('.services-section .service-row');
    if(rows.length){const timeline=gsap.timeline({scrollTrigger:{trigger:'.services-section .service-list',start:'top 75%',end:'bottom 35%',scrub:.4}});rows.forEach(row=>timeline.fromTo(row.querySelector('.service-number'),{y:10},{y:0,duration:1}));}
    gsap.utils.toArray<HTMLElement>('.project img').forEach(el=>gsap.fromTo(el,{y:12},{y:-12,scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}));
   }
  });
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{(entry.target as HTMLElement).dataset.offscreen=String(!entry.isIntersecting);}));
  document.querySelectorAll('.hero-mark img,.marquee-track').forEach(el=>observer.observe(el));
  const visibility=()=>{document.documentElement.dataset.background=String(document.hidden);};visibility();document.addEventListener('visibilitychange',visibility);
  return()=>{mm.revert();observer.disconnect();document.removeEventListener('visibilitychange',visibility);delete document.documentElement.dataset.background;};
 },[path]);return null;
}
export function MotionControl(){const [paused,setPaused]=useState(false);useEffect(()=>{document.documentElement.dataset.motion=paused?'paused':'running';return()=>{delete document.documentElement.dataset.motion;};},[paused]);return <button className="motion-control" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Play motion':'Pause motion'} <span aria-hidden="true">{paused?'▷':'Ⅱ'}</span></button>;}
export function Marquee(){return <div className="marquee" aria-label="Strategy, identity, content, digital"><div className="marquee-track">{[0,1].map(n=><span key={n} aria-hidden={n===1}>STRATEGY <i><Arrow diagonal/></i> IDENTITY <i><Arrow diagonal/></i> CONTENT <i><Arrow diagonal/></i> DIGITAL <i><Arrow diagonal/></i> </span>)}</div></div>;}
