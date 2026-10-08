"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const S: [string, string, string, string[], string, string, string][] = [
  [
    "Social Media",
    "Management",
    "SOCIAL MEDIA MANAGEMENT",
    [
      "Content strategy & calendar",
      "Posts, reels & stories",
      "Community management",
      "Monthly performance reports",
      "Paid social support",
    ],
    "Keep your brand present and consistent with content built for each platform, planned ahead and shaped by what your audience responds to.",
    "Ongoing, monthly",
    "Brands that want steady, consistent growth",
  ],
  [
    "Logo",
    "Design",
    "LOGO DESIGN",
    [
      "Discovery & research",
      "Three distinct concepts",
      "Refinement rounds",
      "Full logo suite",
      "Usage rules",
    ],
    "A mark with a clear idea behind it: simple, memorable and ready to work from a favicon to a billboard.",
    "1–3 weeks",
    "New businesses and refreshes",
  ],
  [
    "Brand",
    "Design",
    "BRAND DESIGN",
    [
      "Brand strategy & voice",
      "Visual identity system",
      "Typography & colour",
      "Brand guidelines",
      "Templates & collateral",
    ],
    "A full visual identity that gives your brand a clear voice and the tools to use it consistently everywhere.",
    "3–6 weeks",
    "Brands ready to look as good as they are",
  ],
  [
    "Video Editing",
    "& Animation",
    "VIDEO EDITING & ANIMATION",
    [
      "Short-form edits & reels",
      "Motion graphics",
      "Explainer animation",
      "Brand & promo films",
      "Captions & sound design",
    ],
    "Moving content with pace and polish, from social cuts to animated explainers that carry your story forward.",
    "3 days – 3 weeks",
    "Launches, campaigns and social content",
  ],
  [
    "Website",
    "Built to work",
    "WEBSITE",
    [
      "UX & structure design",
      "Responsive development",
      "Content management",
      "Launch & optimisation",
      "Accessibility checks",
    ],
    "Create a digital home that connects strong design with clear journeys: responsive, accessible and built to turn visitors into leads.",
    "4–8 weeks",
    "Businesses that need a site that converts",
  ],
  [
    "Automations",
    "That save time",
    "AUTOMATIONS",
    [
      "Workflow mapping",
      "Lead capture & routing",
      "CRM & email flows",
      "Tool integrations",
      "Reporting dashboards",
    ],
    "Connect your tools and remove repetitive work, so enquiries, follow-ups and reporting keep moving without you.",
    "1–3 weeks",
    "Teams losing hours to manual tasks",
  ],
];

// Rich visual project previews for each discipline
const PROJECT_PREVIEWS: Record<
  number,
  { title: string; year: string; tag: string; bg: string; visual: string }[]
> = {
  0: [
    {
      title: "Spring Launch Content",
      year: "2025",
      tag: "CAMPAIGN",
      bg: "linear-gradient(135deg, #2a080a 0%, #120304 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#150406"/><rect x="14" y="9" width="52" height="52" rx="6" fill="#24070a" stroke="#e8241a" stroke-width="1.2"/><circle cx="40" cy="32" r="14" fill="#e8241a" opacity="0.3"/><polygon points="36,26 48,32 36,38" fill="#fff"/><rect x="76" y="16" width="76" height="5" rx="2.5" fill="#fff"/><rect x="76" y="27" width="55" height="4" rx="2" fill="#888"/><rect x="76" y="37" width="65" height="4" rx="2" fill="#555"/><path d="M76,51 C76,49 78,48 80,48 C82,48 83.5,49.5 84,51 C84.5,49.5 86,48 88,48 C90,48 92,49 92,51 C92,54 84,58 84,58 C84,58 76,54 76,51 Z" fill="#e8241a"/><text x="98" y="56" font-size="9" fill="#e8241a" font-weight="bold" font-family="sans-serif">24.8K</text></svg>`,
    },
    {
      title: "Creator Campaign",
      year: "2025",
      tag: "REELS",
      bg: "linear-gradient(135deg, #1c0507 0%, #0a0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#120305"/><rect x="62" y="5" width="46" height="60" rx="6" stroke="#fff" stroke-width="1.2" fill="#1e0508"/><circle cx="85" cy="30" r="12" fill="#e8241a"/><polygon points="82,25 91,30 82,35" fill="#fff"/><circle cx="70" cy="14" r="2.5" fill="#e8241a"/><text x="76" y="16" font-size="6" fill="#fff" font-weight="bold" font-family="sans-serif">LIVE</text><line x1="68" y1="50" x2="102" y2="50" stroke="#ffffff80" stroke-width="1.5"/><line x1="68" y1="56" x2="92" y2="56" stroke="#e8241a" stroke-width="1.5"/></svg>`,
    },
    {
      title: "Community Growth",
      year: "2024",
      tag: "VIRAL",
      bg: "linear-gradient(135deg, #240709 0%, #0f0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#0f0204"/><path d="M15,56 Q55,50 85,36 T155,14" stroke="#e8241a" stroke-width="2.5" fill="none"/><path d="M15,56 Q55,50 85,36 T155,14 L155,64 L15,64 Z" fill="rgba(232,36,26,0.18)"/><circle cx="155" cy="14" r="4" fill="#fff" stroke="#e8241a" stroke-width="2"/><rect x="20" y="10" width="50" height="18" rx="4" fill="#220608" stroke="#e8241a" stroke-width="0.8"/><text x="27" y="23" font-size="9" fill="#fff" font-weight="900" font-family="sans-serif">+340%</text></svg>`,
    },
  ],
  1: [
    {
      title: "Studio Wordmark",
      year: "2025",
      tag: "WORDMARK",
      bg: "linear-gradient(135deg, #240507 0%, #0d0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#100204"/><line x1="15" y1="18" x2="155" y2="18" stroke="#e8241a" stroke-width="0.7" stroke-dasharray="3 3"/><line x1="15" y1="52" x2="155" y2="52" stroke="#e8241a" stroke-width="0.7" stroke-dasharray="3 3"/><text x="85" y="43" font-family="sans-serif" font-weight="900" font-size="28" fill="#fff" text-anchor="middle" letter-spacing="1">RAYZE<tspan fill="#e8241a">.</tspan></text><circle cx="85" cy="35" r="28" stroke="#ffffff12" stroke-width="0.8"/></svg>`,
    },
    {
      title: "Fintech Mark",
      year: "2024",
      tag: "EMBLEM",
      bg: "linear-gradient(135deg, #180305 0%, #080102 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#120304"/><polygon points="85,10 122,58 48,58" stroke="#e8241a" stroke-width="2.5" fill="none"/><polygon points="85,26 108,54 62,54" fill="#fff"/><circle cx="85" cy="38" r="27" stroke="#ffffff15" stroke-width="1" stroke-dasharray="3 3"/></svg>`,
    },
    {
      title: "Café Monogram",
      year: "2024",
      tag: "BADGE",
      bg: "linear-gradient(135deg, #200608 0%, #0c0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#140405"/><circle cx="85" cy="35" r="26" stroke="#fff" stroke-width="1.5"/><circle cx="85" cy="35" r="21" stroke="#e8241a" stroke-width="1" stroke-dasharray="3 2"/><text x="85" y="44" font-size="24" font-weight="900" font-family="serif" fill="#fff" text-anchor="middle">R</text></svg>`,
    },
  ],
  2: [
    {
      title: "Retail Rebrand",
      year: "2025",
      tag: "IDENTITY",
      bg: "linear-gradient(135deg, #28080b 0%, #100203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#130305"/><rect x="18" y="14" width="44" height="42" rx="3" fill="#e8241a"/><text x="25" y="34" font-size="11" font-weight="900" fill="#fff" font-family="sans-serif">Aa</text><rect x="70" y="14" width="22" height="18" rx="2" fill="#ffffff"/><rect x="96" y="14" width="22" height="18" rx="2" fill="#e8241a"/><rect x="122" y="14" width="22" height="18" rx="2" fill="#333333"/><rect x="70" y="38" width="74" height="18" rx="2" stroke="#ffffff35" stroke-width="1" fill="#1f0507"/><line x1="76" y1="47" x2="114" y2="47" stroke="#e8241a" stroke-width="2"/></svg>`,
    },
    {
      title: "Wellness Identity",
      year: "2025",
      tag: "SYSTEM",
      bg: "linear-gradient(135deg, #1a0406 0%, #090102 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#110304"/><circle cx="68" cy="35" r="23" stroke="#e8241a" stroke-width="2" fill="rgba(232,36,26,0.2)"/><circle cx="102" cy="35" r="23" stroke="#fff" stroke-width="2" fill="rgba(255,255,255,0.08)"/><text x="85" y="62" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="2" font-family="sans-serif">SANCTUARY</text></svg>`,
    },
    {
      title: "Tech Guidelines",
      year: "2024",
      tag: "MANUAL",
      bg: "linear-gradient(135deg, #220608 0%, #0c0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#0f0203"/><rect x="20" y="11" width="130" height="48" rx="4" stroke="#ffffff30" stroke-width="1" fill="#180406"/><rect x="28" y="20" width="30" height="6" rx="2" fill="#e8241a"/><rect x="28" y="31" width="70" height="4" rx="2" fill="#fff"/><rect x="28" y="40" width="50" height="4" rx="2" fill="#666"/><rect x="110" y="20" width="30" height="30" rx="3" stroke="#e8241a" stroke-width="1"/><circle cx="125" cy="35" r="8" fill="#e8241a"/></svg>`,
    },
  ],
  3: [
    {
      title: "Brand Film",
      year: "2025",
      tag: "CINEMA",
      bg: "linear-gradient(135deg, #2e080b 0%, #120304 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#170406"/><rect x="18" y="9" width="134" height="52" rx="4" stroke="#e8241a" stroke-width="1.5" fill="#0f0203"/><circle cx="85" cy="35" r="16" stroke="#e8241a" stroke-width="1.5"/><polygon points="81,28 94,35 81,42" fill="#fff"/><line x1="28" y1="54" x2="142" y2="54" stroke="#e8241a" stroke-width="2"/><circle cx="72" cy="54" r="3" fill="#fff"/></svg>`,
    },
    {
      title: "Product Explainer",
      year: "2024",
      tag: "3D MOTION",
      bg: "linear-gradient(135deg, #1c0507 0%, #090102 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#120304"/><polygon points="85,12 116,28 85,44 54,28" fill="#e8241a" opacity="0.85"/><polygon points="54,28 85,44 85,58 54,42" fill="#680f13"/><polygon points="116,28 85,44 85,58 116,42" fill="#a8191f"/><ellipse cx="85" cy="34" rx="46" ry="16" stroke="#fff" stroke-width="1" stroke-dasharray="4 2" fill="none"/></svg>`,
    },
    {
      title: "Motion Reel",
      year: "2025",
      tag: "REEL",
      bg: "linear-gradient(135deg, #250709 0%, #0e0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#150406"/><rect x="14" y="14" width="142" height="42" rx="3" fill="#200507" stroke="#e8241a" stroke-width="1.2"/><rect x="18" y="17" width="8" height="6" rx="1" fill="#fff"/><rect x="30" y="17" width="8" height="6" rx="1" fill="#fff"/><rect x="42" y="17" width="8" height="6" rx="1" fill="#fff"/><polygon points="80,27 92,35 80,43" fill="#e8241a"/><polygon points="90,27 102,35 90,43" fill="#fff"/><rect x="18" y="47" width="8" height="6" rx="1" fill="#fff"/><rect x="30" y="47" width="8" height="6" rx="1" fill="#fff"/><rect x="42" y="47" width="8" height="6" rx="1" fill="#fff"/></svg>`,
    },
  ],
  4: [
    {
      title: "Agency Site",
      year: "2025",
      tag: "EXPERIENCE",
      bg: "linear-gradient(135deg, #240507 0%, #0c0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#140305"/><rect x="16" y="7" width="138" height="56" rx="4" fill="#1e0507" stroke="#fff" stroke-width="1"/><circle cx="26" cy="14" r="2.5" fill="#e8241a"/><circle cx="34" cy="14" r="2.5" fill="#ffffff50"/><circle cx="42" cy="14" r="2.5" fill="#ffffff50"/><line x1="16" y1="21" x2="154" y2="21" stroke="#ffffff20" stroke-width="1"/><rect x="26" y="28" width="46" height="28" fill="#e8241a" opacity="0.8"/><rect x="80" y="30" width="55" height="5" rx="2" fill="#fff"/><rect x="80" y="39" width="40" height="3" rx="1.5" fill="#888"/><rect x="80" y="48" width="30" height="6" rx="3" fill="#e8241a"/></svg>`,
    },
    {
      title: "E-commerce Store",
      year: "2025",
      tag: "CONVERSION",
      bg: "linear-gradient(135deg, #180305 0%, #070102 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#100305"/><rect x="18" y="10" width="56" height="50" rx="3" stroke="#e8241a" stroke-width="1" fill="#1c0507"/><rect x="24" y="16" width="44" height="28" fill="#e8241a" opacity="0.6"/><rect x="24" y="48" width="24" height="6" rx="2" fill="#fff"/><rect x="86" y="10" width="66" height="23" rx="3" stroke="#ffffff30" stroke-width="1" fill="#180406"/><text x="94" y="25" font-size="8" fill="#fff" font-weight="bold" font-family="sans-serif">CART (3)</text><rect x="86" y="37" width="66" height="23" rx="3" fill="#e8241a"/><text x="97" y="52" font-size="8" fill="#fff" font-weight="900" font-family="sans-serif">CHECKOUT</text></svg>`,
    },
    {
      title: "Portfolio Site",
      year: "2024",
      tag: "PORTFOLIO",
      bg: "linear-gradient(135deg, #220608 0%, #0d0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#120304"/><rect x="16" y="10" width="40" height="50" rx="3" fill="#e8241a" stroke="#fff" stroke-width="0.8"/><rect x="62" y="10" width="46" height="23" rx="3" fill="#250609" stroke="#e8241a" stroke-width="0.8"/><rect x="62" y="37" width="46" height="23" rx="3" fill="#180406" stroke="#ffffff30" stroke-width="0.8"/><rect x="114" y="10" width="40" height="50" rx="3" fill="#30070a" stroke="#e8241a" stroke-width="0.8"/></svg>`,
    },
  ],
  5: [
    {
      title: "Lead Flow",
      year: "2025",
      tag: "PIPELINE",
      bg: "linear-gradient(135deg, #200507 0%, #0a0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#100305"/><circle cx="30" cy="35" r="14" fill="#1f0507" stroke="#e8241a" stroke-width="1.5"/><text x="30" y="38" font-size="8" fill="#fff" font-weight="bold" text-anchor="middle" font-family="sans-serif">IN</text><line x1="44" y1="35" x2="72" y2="35" stroke="#e8241a" stroke-width="2"/><circle cx="85" cy="35" r="13" fill="#e8241a"/><polygon points="81,30 91,35 81,40" fill="#fff"/><line x1="98" y1="35" x2="126" y2="35" stroke="#fff" stroke-width="2" stroke-dasharray="3 2"/><rect x="126" y="23" width="26" height="24" rx="4" fill="#220608" stroke="#fff" stroke-width="1.2"/><text x="139" y="38" font-size="8" fill="#fff" font-weight="bold" text-anchor="middle" font-family="sans-serif">CRM</text></svg>`,
    },
    {
      title: "CRM Sync",
      year: "2024",
      tag: "INTEGRATION",
      bg: "linear-gradient(135deg, #180305 0%, #070102 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#120304"/><rect x="22" y="19" width="36" height="32" rx="4" fill="#1e0507" stroke="#fff" stroke-width="1.2"/><rect x="112" y="19" width="36" height="32" rx="4" fill="#1e0507" stroke="#e8241a" stroke-width="1.2"/><path d="M68,27 L102,27 M96,22 L102,27 L96,32" stroke="#e8241a" stroke-width="2"/><path d="M102,43 L68,43 M74,38 L68,43 L74,48" stroke="#fff" stroke-width="2"/><circle cx="85" cy="35" r="6" fill="#e8241a"/><polyline points="82,35 84,37 88,33" stroke="#fff" stroke-width="1.2" fill="none"/></svg>`,
    },
    {
      title: "Auto Reporting",
      year: "2025",
      tag: "DASHBOARD",
      bg: "linear-gradient(135deg, #220608 0%, #0c0203 100%)",
      visual: `<svg viewBox="0 0 170 70" fill="none" preserveAspectRatio="xMidYMid meet"><rect width="170" height="70" fill="#0f0203"/><rect x="28" y="44" width="16" height="18" rx="2" fill="#444"/><rect x="50" y="34" width="16" height="28" rx="2" fill="#888"/><rect x="72" y="22" width="16" height="40" rx="2" fill="#e8241a"/><rect x="94" y="14" width="16" height="48" rx="2" fill="#fff"/><circle cx="102" cy="10" r="3" fill="#e8241a"/><line x1="18" y1="62" x2="152" y2="62" stroke="#ffffff30" stroke-width="1"/><text x="120" y="32" font-size="10" font-weight="900" fill="#fff" font-family="sans-serif">AUTO</text><text x="120" y="44" font-size="8" font-weight="700" fill="#e8241a" font-family="sans-serif">DAILY</text></svg>`,
    },
  ],
};

const bgs = ["--c0", "--c1", "--c2", "--c3", "--c4", "--c5"];
const n = S.length;

function rhtml(i: number) {
  const items = PROJECT_PREVIEWS[i] || PROJECT_PREVIEWS[0];
  const serviceShort = S[i][2].split(" ")[0];
  return items
    .map(
      (item) => `
        <div class="r" style="--bg-card:${item.bg}; background:${item.bg};">
          <div class="r-top-bar">
            <span class="r-tag-pill">${item.tag}</span>
            <span class="r-year">${item.year}</span>
          </div>
          <div class="r-visual-wrap">${item.visual}</div>
          <div class="r-meta-wrap">
            <span class="r-title">${item.title}</span>
            <span class="r-sub">${serviceShort} · ${item.year}</span>
          </div>
        </div>
      `
    )
    .join("");
}

export function Services() {
  const mounted = useMounted();
  const trackRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const pvRef = useRef<HTMLDivElement>(null);

  const curRef = useRef(0);
  const tgtRef = useRef(0);
  const runningRef = useRef(false);

  // Mouse coordinates & physics for .services-pv
  const isHoveringRef = useRef(false);
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const pxRef = useRef(0);
  const pyRef = useRef(0);
  const prRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const loopRef = useRef<() => void>(() => {});
  const pvLoopRef = useRef<() => void>(() => {});

  const step = useCallback(() => {
    return typeof window !== "undefined" ? window.innerHeight * 0.75 : 600;
  }, []);

  const setH = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.style.height = `${step() * (n - 1) + window.innerHeight}px`;
  }, [step]);

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const cl = useCallback(
    (v: number, a: number, b: number) => Math.max(a, Math.min(b, v)),
    []
  );

  const render = useCallback(() => {
    if (!stackRef.current) return;
    const cs = getComputedStyle(document.documentElement);
    const p = parseFloat(cs.getPropertyValue("--peek")) || 62;
    const H = stackRef.current.offsetHeight;
    const cards = Array.from(stackRef.current.children) as HTMLElement[];
    const cur = curRef.current;

    cards.forEach((c, i) => {
      const f = ease(cl(cur - (i - 1), 0, 1));
      const bot = H - (n - i) * p;
      const top = i === 0 ? 0 : bot + (i * p - bot) * f;
      const back = Math.max(0, cur - i);
      const d = Math.abs(cur - i);
      const o = cl(1 - (d - 0.15) * 1.7, 0, 1);
      c.style.top = `${top}px`;
      c.style.transform = `scale(${1 - Math.min(back, 3) * 0.012})`;
      c.style.filter = `brightness(${1 - Math.min(back, 4) * 0.07})`;

      const b = c.children[1] as HTMLElement | undefined;
      if (b) {
        b.style.opacity = `${o}`;
        b.style.transform = `translateY(${(i - cur) * 28}px)`;
      }

      const on = Math.round(cur) === i;
      c.classList.toggle("on", on);
      c.setAttribute("aria-expanded", String(on));
    });

    const k = cl(Math.round(cur), 0, n - 1);
    if (progRef.current) {
      progRef.current.style.transform = `scaleY(${cur / (n - 1)})`;
    }
    if (countRef.current) {
      countRef.current.textContent = `0${k + 1} / 0${n} — ${S[k][2]}`;
    }
  }, [cl]);

  const loop = useCallback(() => {
    curRef.current += (tgtRef.current - curRef.current) * 0.1;
    if (Math.abs(tgtRef.current - curRef.current) < 0.0008) {
      curRef.current = tgtRef.current;
      runningRef.current = false;
    }
    render();
    if (runningRef.current) {
      requestAnimationFrame(loopRef.current);
    }
  }, [render]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const kick = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(loopRef.current);
    }
  }, []);

  const onScroll = useCallback(() => {
    if (!trackRef.current) return;
    const top = trackRef.current.getBoundingClientRect().top;
    tgtRef.current = cl(-top / step(), 0, n - 1);
    kick();
  }, [cl, kick, step]);

  const go = useCallback(
    (i: number) => {
      if (!trackRef.current) return;
      const top = trackRef.current.getBoundingClientRect().top;
      window.scrollTo({
        top: top + window.scrollY + i * step(),
        behavior: "smooth",
      });
    },
    [step]
  );

  // Smooth inertial tracking for floating project cards
  const pvLoop = useCallback(() => {
    const pv = pvRef.current;
    if (!pv) return;

    const vx = mxRef.current - pxRef.current;
    const vy = myRef.current - pyRef.current;
    pxRef.current += vx * 0.16;
    pyRef.current += vy * 0.16;

    const rot = Math.max(-7, Math.min(7, vx * 0.05));
    pv.style.transform = `translate3d(${pxRef.current}px, ${pyRef.current}px, 0) rotate(${rot}deg)`;

    if (isHoveringRef.current || Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) {
      animFrameRef.current = requestAnimationFrame(pvLoopRef.current);
    } else {
      prRef.current = false;
    }
  }, []);

  useEffect(() => {
    pvLoopRef.current = pvLoop;
  }, [pvLoop]);

  const showPreview = (e: React.MouseEvent, i: number) => {
    const pv = pvRef.current;
    if (!pv) return;

    isHoveringRef.current = true;
    pv.innerHTML = rhtml(i);
    // Force layout reflow so stagger transitions trigger smoothly
    void pv.offsetWidth;
    pv.classList.add("show");

    const targetX = Math.min(
      Math.max(e.clientX + 20, 16),
      window.innerWidth - 640
    );
    const targetY = Math.max(e.clientY - 160, 16);

    mxRef.current = targetX;
    myRef.current = targetY;

    if (!prRef.current) {
      pxRef.current = targetX;
      pyRef.current = targetY;
      prRef.current = true;
      pvLoop();
    }
  };

  const movePreview = (e: React.MouseEvent) => {
    const pv = pvRef.current;
    if (!pv) return;

    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      pv.classList.add("show");
    }

    const targetX = Math.min(
      Math.max(e.clientX + 20, 16),
      window.innerWidth - 640
    );
    const targetY = Math.max(e.clientY - 160, 16);

    mxRef.current = targetX;
    myRef.current = targetY;

    if (!prRef.current) {
      prRef.current = true;
      pvLoop();
    }
  };

  const hidePreview = (e?: React.MouseEvent) => {
    if (
      e &&
      e.relatedTarget &&
      (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)
    ) {
      return;
    }
    isHoveringRef.current = false;
    const pv = pvRef.current;
    if (pv) {
      pv.classList.remove("show");
    }
  };

  useEffect(() => {
    setH();
    onScroll();
    curRef.current = tgtRef.current;
    render();

    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      setH();
      onScroll();
      render();
    };
    window.addEventListener("resize", onResize);

    // Scroll reveal observer for .rv elements
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const rvElements = document.querySelectorAll(".services-stacked-page .rv");
    rvElements.forEach((el) => io.observe(el));

    // Support jumping to service if url hash is present
    if (window.location.hash) {
      const match = window.location.hash.match(/#service-(\d+)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        if (!isNaN(idx) && idx >= 0 && idx < n) {
          setTimeout(() => go(idx), 350);
        }
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [setH, onScroll, render, go]);

  return (
    <div className="services-stacked-page">
      {/* ── Top Header ── */}
      <section>
        <div className="eyebrow">What we do</div>
        <h2>
          The idea is
          <br />
          just the start.
        </h2>
        <p className="lead">
          Six connected disciplines. One clear direction for your brand. Choose
          where you need us, and we&apos;ll shape the work around you.
        </p>
      </section>

      {/* ── Stacking Cards Pin Track ── */}
      <div className="track" id="track" ref={trackRef}>
        <div className="pin">
          <div className="count" id="count" ref={countRef}></div>
          <div className="prog">
            <i id="prog" ref={progRef}></i>
          </div>
          <div className="stack" id="stack" ref={stackRef}>
            {S.map((s, i) => (
              <div
                key={s[2]}
                className="card"
                id={`service-${i}`}
                role="button"
                tabIndex={0}
                data-i={i}
                style={
                  {
                    "--bgc": `var(${bgs[i]})`,
                    zIndex: i,
                  } as React.CSSProperties
                }
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest(".go")) {
                    go(i);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    go(i);
                  }
                }}
                onMouseEnter={(e) => showPreview(e, i)}
                onMouseMove={movePreview}
                onMouseLeave={hidePreview}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mx",
                    `${e.clientX - r.left}px`
                  );
                  e.currentTarget.style.setProperty(
                    "--my",
                    `${e.clientY - r.top}px`
                  );
                }}
              >
                <div
                  className="head"
                  onMouseEnter={(e) => showPreview(e, i)}
                  onMouseMove={movePreview}
                  onMouseLeave={hidePreview}
                >
                  <span className="num">0{i + 1}</span>
                  <div
                    className="t"
                    onMouseEnter={(e) => showPreview(e, i)}
                    onMouseMove={movePreview}
                    onMouseLeave={hidePreview}
                  >
                    {s[0]} <span>{s[1]}</span>
                  </div>
                  <Link
                    className="go"
                    href={`/contact?service=${encodeURIComponent(s[2])}`}
                    aria-label={`Enquire about ${s[2]}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ↗
                  </Link>
                </div>

                <div className="body">
                  <b className="ghost">0{i + 1}</b>
                  <div className="left">
                    <p className="desc">{s[4]}</p>
                    <div className="meta">
                      <div>
                        <small>Typical timeline</small>
                        {s[5]}
                      </div>
                      <div>
                        <small>Best for</small>
                        {s[6]}
                      </div>
                    </div>
                  </div>
                  <div className="inc">
                    <small>What&apos;s included</small>
                    <ul>
                      {s[3].map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="strip"
                    dangerouslySetInnerHTML={{ __html: rhtml(i) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Process Section ── */}
      <section className="proc">
        <div className="eyebrow rv">From idea to impact</div>
        <h2 className="rv">
          Big thinking.
          <br />
          <b>Clear process.</b>
        </h2>
        <div className="steps">
          <div className="st rv">
            <b>01</b>
            <h3>Understand</h3>
            <p>
              Start with your business, your audience and the problem worth
              solving.
            </p>
          </div>
          <div className="st rv">
            <b>02</b>
            <h3>Create</h3>
            <p>
              Turn a focused direction into considered design, content and
              experiences.
            </p>
          </div>
          <div className="st rv">
            <b>03</b>
            <h3>Move forward</h3>
            <p>
              Refine the details, launch with care and give you the tools to keep
              going.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services Bottom CTA Section ── */}
      <section className="services-bottom-cta">
        <div className="services-cta-inner">
          <div className="eyebrow rv">Ready to rise?</div>
          <h2 className="rv">
            Let&apos;s build something{" "}
            <span className="highlight-red">worth remembering.</span>
          </h2>
          <p className="services-cta-sub rv">
            Got an idea, a project, or a brand ready to scale? Let’s map the
            strategy and make it happen.
          </p>
          <div className="services-cta-action rv">
            <Link className="services-cta-btn" href="/contact">
              <span className="btn-sweep" aria-hidden="true" />
              <span className="btn-corner btn-corner-tl" aria-hidden="true" />
              <span className="btn-corner btn-corner-br" aria-hidden="true" />
              <span className="btn-content">
                <span className="btn-dot" aria-hidden="true" />
                <span className="btn-text">Start a project</span>
              </span>
              <span className="btn-divider" aria-hidden="true" />
              <span className="btn-arrow-box">
                <span className="btn-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Floating Project Preview Cards (Mounted to body for true viewport freedom) ── */}
      {mounted &&
        createPortal(
          <div
            className="services-pv"
            id="pv"
            ref={pvRef}
            aria-hidden="true"
          />,
          document.body
        )}
    </div>
  );
}

export default Services;
