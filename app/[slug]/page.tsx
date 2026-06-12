"use client";
<<<<<<< HEAD
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ExternalLink, Lock, AlertCircle, Zap, AlertTriangle,
  RefreshCw, Share2, Facebook, Twitter, Send, MessageCircle,
  Clock, ChevronRight, BookOpen, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────
interface AdEntry { id: string; placement: string; code: string; }
interface ArticleSection { title: string; content: string; }
interface LinkInfo {
  id: string; slug: string; originalUrl: string; title?: string;
  hasPassword: boolean; adSteps: number; adTimer: number; sessionKey: string;
  articleTitle: string; articleSections: ArticleSection[];
  ads: AdEntry[];
}

// ─── Ad Blocker Detection ─────────────────────────────────────────────
async function detectAdBlock(): Promise<boolean> {
  const bait = document.createElement("div");
  bait.className = "ad ads adsbox ad-slot ad-unit doubleclick carbon-ad pub_300x250 banner-ads";
  bait.setAttribute("data-ad-unit", "banner");
  bait.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;";
  document.body.appendChild(bait);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300))));
  if (!document.body.contains(bait)) return true;
  const cs = window.getComputedStyle(bait);
  const hit = bait.offsetHeight===0||bait.offsetWidth===0||cs.display==="none"||cs.visibility==="hidden"||cs.opacity==="0";
  bait.remove();
  if (hit) return true;
  try {
    await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      { method:"HEAD", mode:"no-cors", cache:"no-store", signal:AbortSignal.timeout(2500) });
    return false;
  } catch { return true; }
}
function useAdBlock() {
  const [blocked, setBlocked] = useState<boolean|null>(null);
  const check = useCallback(() => { setBlocked(null); detectAdBlock().then(setBlocked); }, []);
  useEffect(() => { check(); }, [check]);
  return { blocked, recheck: check };
}

// ─── Split HTML into N equal parts ───────────────────────────────────
function splitContent(html: string, parts = 4): string[] {
  if (!html?.trim()) return [""];
  const segs = html.split(/(?<=<\/p>)/gi).filter(s => s.trim());
  if (segs.length <= 1) return [html];
  const n = Math.min(parts, segs.length);
  const perPart = Math.ceil(segs.length / n);
  const result: string[] = [];
  for (let i = 0; i < segs.length; i += perPart)
    result.push(segs.slice(i, i + perPart).join(""));
  return result;
}

// ─── Banner Ad with load-complete callback ────────────────────────────
// onLoaded() fires when:
//   • All external scripts have downloaded (onload/onerror), AND
//   • A 1.5 s grace period passes for the ad to render visually, OR
//   • 10 s hard timeout (in case the network is slow)
function BannerAd({
  code, blocked, onLoaded,
}: {
  code: string;
  blocked: boolean;
  onLoaded: () => void;
}) {
  const ref      = useRef<HTMLDivElement>(null);
  const reported = useRef(false);

  const done = useCallback(() => {
    if (reported.current) return;
    reported.current = true;
    onLoaded();
  }, [onLoaded]);

  useEffect(() => {
    // If ad-blocker is active, report immediately — don't block the timer
    if (blocked) { done(); return; }
    if (!ref.current || !code) { done(); return; }

    const el = ref.current;
    el.innerHTML = "";

    // Hard timeout: 10 s max wait regardless of ad network
    const hardTimeout = setTimeout(done, 10_000);

    const run = async () => {
      try {
        el.innerHTML = code;
        const exts = Array.from(el.querySelectorAll<HTMLScriptElement>("script[src]"));
        const inls = Array.from(el.querySelectorAll<HTMLScriptElement>("script:not([src])"));

        // Load external scripts sequentially, wait for each
        for (const s of exts) {
          await new Promise<void>(res => {
            const ns = document.createElement("script");
            Array.from(s.attributes).forEach(a => ns.setAttribute(a.name, a.value));
            ns.onload  = () => res();
            ns.onerror = () => res();
            s.parentNode?.replaceChild(ns, s);
          });
        }
        // Run inline scripts
        for (const s of inls) {
          const ns = document.createElement("script");
          Array.from(s.attributes).forEach(a => ns.setAttribute(a.name, a.value));
          ns.textContent = s.textContent;
          s.parentNode?.replaceChild(ns, s);
          await new Promise(r => setTimeout(r, 20));
        }
        // Grace period: let the ad render visually
        await new Promise(r => setTimeout(r, 1500));
        clearTimeout(hardTimeout);
        done();
      } catch {
        clearTimeout(hardTimeout);
        done();
      }
    };

    const startDelay = setTimeout(run, 80);
    return () => { clearTimeout(startDelay); clearTimeout(hardTimeout); };
  }, [code, blocked, done]);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[rgba(15,15,26,0.5)]">
      <p className="text-center text-[10px] text-[#4B5563] py-1 border-b border-white/5 uppercase tracking-widest">
        Advertisement
      </p>
      {blocked
        ? <div className="flex items-center justify-center gap-2 py-4 text-yellow-500/60 text-xs">
            <AlertTriangle className="w-4 h-4"/>مانع إعلانات مكتشف
          </div>
        : code
          ? <div ref={ref} style={{ minHeight:90, width:"100%", overflow:"hidden" }} />
          : <div className="py-6 text-center text-[#4B5563] text-xs">Ad Space</div>
      }
=======
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ExternalLink, ChevronRight, Lock, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────
interface LinkInfo {
  id: string;
  slug: string;
  originalUrl: string;
  title?: string;
  hasPassword: boolean;
  adSteps: number;
  adTimer: number;
  ads: Array<{ id: string; code: string; placement: string }>;
}

interface StepState {
  currentStep: number;
  totalSteps: number;
  sessionKey: string;
  completed: boolean;
}

// ─── Countdown Ring Component ────────────────────────────────────────
function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds / total;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="6" stroke="rgba(255,255,255,0.05)" />
        <motion.circle
          cx="60" cy="60" r={radius}
          fill="none" strokeWidth="6"
          stroke="url(#timerGradient)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transition={{ duration: 1, ease: "linear" }}
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#8A2BE2" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-white">{seconds}</span>
        <span className="text-xs text-[#6B7280]">seconds</span>
      </div>
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    </div>
  );
}

<<<<<<< HEAD
// ─── Social Bar ───────────────────────────────────────────────────────
function SocialBar({ url, title }: { url:string; title:string }) {
  const eu = encodeURIComponent(url), et = encodeURIComponent(title);
  const btns = [
    { l:"Facebook",  I:Facebook,      bg:"bg-[#1877F2]", h:`https://www.facebook.com/sharer/sharer.php?u=${eu}` },
    { l:"Twitter",   I:Twitter,        bg:"bg-[#14171A]", h:`https://twitter.com/intent/tweet?url=${eu}&text=${et}` },
    { l:"WhatsApp",  I:MessageCircle,  bg:"bg-[#25D366]", h:`https://wa.me/?text=${et}%20${eu}` },
    { l:"Telegram",  I:Send,           bg:"bg-[#2CA5E0]", h:`https://t.me/share/url?url=${eu}&text=${et}` },
  ];
  return (
    <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/10">
      <Share2 className="w-3.5 h-3.5 text-[#6B7280]"/>
      <span className="text-xs text-[#6B7280]">شارك:</span>
      {btns.map(b=>(
        <a key={b.l} href={b.h} target="_blank" rel="noopener noreferrer"
          className={`w-8 h-8 rounded-full ${b.bg} flex items-center justify-center text-white hover:scale-110 transition-transform`}>
          <b.I className="w-3.5 h-3.5"/>
        </a>
=======
// ─── Ad Slot ─────────────────────────────────────────────────────────
function AdSlot({ code, label }: { code: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !code) return;
    try {
      // Execute ad script in a sandboxed way
      const el = ref.current;
      el.innerHTML = code;
      const scripts = el.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    } catch {
      // Silent fail for ad scripts
    }
  }, [code]);

  return (
    <div className="ad-slot rounded-2xl overflow-hidden">
      <p className="ad-slot-label">Advertisement</p>
      {code ? (
        <div ref={ref} className="min-h-[100px] flex items-center justify-center" />
      ) : (
        <div className="min-h-[100px] flex items-center justify-center text-[#4B5563] text-sm">
          Ad Space
        </div>
      )}
    </div>
  );
}

// ─── Progress Steps ───────────────────────────────────────────────────
function ProgressSteps({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
            i + 1 < current
              ? "bg-[#00FF88] text-black"
              : i + 1 === current
                ? "bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] text-white shadow-[0_0_15px_rgba(0,191,255,0.5)]"
                : "bg-white/5 border border-white/10 text-[#6B7280]"
          )}>
            {i + 1 < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div className={cn(
              "w-8 h-0.5 rounded-full transition-all duration-500",
              i + 1 < current ? "bg-[#00FF88]" : "bg-white/10"
            )} />
          )}
        </div>
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      ))}
    </div>
  );
}

<<<<<<< HEAD
// ─── Article Step Card ────────────────────────────────────────────────
// Shows FULL article immediately with N banners between sections.
// "Next Page" button unlocks only when:
//   (a) 30-second timer has elapsed  AND
//   (b) ALL banner ads have reported onLoaded()
function ArticleStepCard({
  step, total, section, adCode, adTimer, adBlocked,
  articleTitle, shareUrl, onNext, isLast,
}: {
  step:number; total:number; section:ArticleSection;
  adCode:string; adTimer:number; adBlocked:boolean;
  articleTitle:string; shareUrl:string;
  onNext:()=>void; isLast:boolean;
}) {
  const BANNER_COUNT = 3; // 3 banners per step

  const [timeLeft,    setTimeLeft]    = useState(adTimer);
  const [timerDone,   setTimerDone]   = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Split article into (BANNER_COUNT + 1) visible sections
  const parts = useMemo(
    () => splitContent(section.content, BANNER_COUNT + 1),
    [section.content]
  );

  // Reset when step changes
  useEffect(() => {
    setTimeLeft(adTimer);
    setTimerDone(false);
    setLoadedCount(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { setTimerDone(true); clearInterval(timerRef.current); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step, adTimer]);

  const handleAdLoaded = useCallback(() => {
    setLoadedCount(p => p + 1);
  }, []);

  const allAdsLoaded = loadedCount >= BANNER_COUNT;
  const canNext      = timerDone && (allAdsLoaded || adBlocked);

  // Status text for the button
  const statusLabel = () => {
    if (canNext)        return isLast ? "انتقل للرابط" : "الصفحة التالية";
    if (!timerDone)     return `انتظر ${timeLeft}s`;
    if (!allAdsLoaded)  return `جاري تحميل الإعلانات… (${loadedCount}/${BANNER_COUNT})`;
    return "";
  };

  return (
    <motion.div key={step} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}}
      exit={{opacity:0,x:-30}} transition={{duration:0.35}} className="space-y-4">

      {/* Header */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-[#00BFFF]"/>
          <span className="text-xs font-mono text-[#6B7280] uppercase tracking-widest">
            الصفحة {step} من {total}
          </span>
        </div>
        <h1 className="font-display text-base font-bold text-white">{articleTitle}</h1>
        <div className="flex gap-1.5 mt-3">
          {Array.from({length:total}).map((_,i)=>(
            <div key={i} className={cn("flex-1 h-1.5 rounded-full transition-all duration-500",
              i+1<step?"bg-[#00FF88]":i+1===step?"bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2]":"bg-white/10")}/>
          ))}
        </div>
      </div>

      {/* Full article + banners */}
      <div className="glass-card p-6 space-y-5">
        {section.title && (
          <h2 className="font-display text-sm font-semibold text-white pb-3 border-b border-white/10">
            {section.title}
          </h2>
        )}

        {parts.map((part, i) => (
          <div key={i} className="space-y-5">
            {/* Article text part */}
            <div className="text-[#9CA3AF] text-sm leading-relaxed" style={{direction:"rtl"}}
              dangerouslySetInnerHTML={{__html: part}}/>
            {/* Banner after each part except last */}
            {i < parts.length - 1 && i < BANNER_COUNT && (
              <BannerAd
                key={`ad-${step}-${i}`}
                code={adCode}
                blocked={adBlocked}
                onLoaded={handleAdLoaded}
              />
            )}
          </div>
        ))}

        {/* If content has fewer parts than banners, add remaining banners */}
        {Array.from({length: Math.max(0, BANNER_COUNT - (parts.length - 1))}).map((_, i) => (
          <BannerAd
            key={`ad-${step}-extra-${i}`}
            code={adCode}
            blocked={adBlocked}
            onLoaded={handleAdLoaded}
          />
        ))}

        <SocialBar url={shareUrl} title={articleTitle}/>
      </div>

      {/* Timer + Next button */}
      <div className="glass-card p-4 flex items-center gap-3">
        {/* Timer */}
        <div className="flex items-center gap-2 min-w-[70px]">
          <Clock className={cn("w-4 h-4", timerDone?"text-[#00FF88]":"text-[#6B7280]")}/>
          {timerDone
            ? <span className="text-sm font-semibold text-[#00FF88]">✓</span>
            : <span className="text-xl font-bold text-white font-mono">{timeLeft}s</span>}
        </div>

        {/* Progress */}
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2]"
            animate={{width:`${((adTimer-timeLeft)/adTimer)*100}%`}}
            transition={{duration:0.5}}/>
        </div>

        {/* Next button */}
        <motion.button
          onClick={() => canNext && onNext()}
          disabled={!canNext}
          whileHover={canNext?{scale:1.04}:{}}
          whileTap={canNext?{scale:0.97}:{}}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0",
            canNext
              ? "btn-neon"
              : "bg-white/5 border border-white/10 text-[#4B5563] cursor-not-allowed"
          )}
        >
          {!canNext && !timerDone   && <Clock className="w-3.5 h-3.5"/>}
          {!canNext && timerDone    && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
          <span>{statusLabel()}</span>
          {canNext && <ChevronRight className="w-4 h-4"/>}
        </motion.button>
      </div>

    </motion.div>
  );
}

// ─── Password Form ────────────────────────────────────────────────────
function PasswordForm({ slug, onSuccess }: { slug:string; onSuccess:()=>void }) {
  const [pw,setPw]=useState(""), [err,setErr]=useState(""), [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const r = await fetch(`/api/links/${slug}/verify`,
      {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})}).catch(()=>null);
    r?.ok?onSuccess():setErr("Incorrect password");
    setLoading(false);
  }
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(138,43,226,0.1)] border border-[rgba(138,43,226,0.3)] flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-[#8A2BE2]"/>
      </div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Protected Link</h2>
      <p className="text-[#6B7280] text-sm mb-8">This link requires a password.</p>
      <form onSubmit={submit} className="space-y-4 max-w-xs mx-auto">
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
          placeholder="Enter password" required className="input-neon text-center text-lg tracking-widest"/>
        {err&&<div className="flex items-center justify-center gap-2 text-[#FF007F] text-sm"><AlertCircle className="w-4 h-4"/>{err}</div>}
        <button type="submit" disabled={loading} className="btn-neon w-full py-3 rounded-xl font-semibold">
          {loading?"Checking...":"Unlock"}
=======
// ─── Password Form ────────────────────────────────────────────────────
function PasswordForm({ slug, onSuccess }: { slug: string; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/links/${slug}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(138,43,226,0.1)] border border-[rgba(138,43,226,0.3)] flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-[#8A2BE2]" />
      </div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Protected Link</h2>
      <p className="text-[#6B7280] text-sm mb-8">This link requires a password to access.</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          className="input-neon text-center text-lg tracking-widest"
        />
        {error && (
          <div className="flex items-center justify-center gap-2 text-[#FF007F] text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-neon w-full py-3 rounded-xl font-semibold">
          {loading ? "Checking..." : "Unlock Link"}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
        </button>
      </form>
    </div>
  );
}

<<<<<<< HEAD
// ─── Main Page ────────────────────────────────────────────────────────
export default function RedirectPage() {
  const {slug} = useParams<{slug:string}>();
  const [phase,setPhase] = useState<"loading"|"password"|"steps"|"done"|"error">("loading");
  const [info,setInfo]   = useState<LinkInfo|null>(null);
  const [step,setStep]   = useState(1);
  const [error,setError] = useState("");
  const {blocked,recheck} = useAdBlock();
  const shareUrl = typeof window!=="undefined"?window.location.href:"";

  useEffect(()=>{
    fetch(`/api/links/${slug}/info`).then(r=>r.json()).then(data=>{
      if(!data.success){setError(data.error??"Link not found");setPhase("error");return;}
      setInfo(data.data);
      if(data.data.hasPassword) setPhase("password");
      else if(data.data.adSteps>0) setPhase("steps");
      else{setPhase("done");setTimeout(()=>{window.location.href=data.data.originalUrl;},1200);}
    }).catch(()=>{setError("Failed to load");setPhase("error");});
  },[slug]);

  const handleNext = useCallback(()=>{
    if(!info) return;
    if(step>=info.adSteps){
      setPhase("done");
      fetch(`/api/links/${slug}/complete`,
        {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionKey:info.sessionKey})}).catch(()=>{});
      setTimeout(()=>{window.location.href=info.originalUrl;},1200);
    } else setStep(s=>s+1);
  },[info,step,slug]);

  const stepAds  = info?.ads?.filter(a=>a.placement?.startsWith("STEP_"))??[];
  const globalAd = info?.ads?.find(a=>a.placement==="GLOBAL")?.code??"";
  const adCode   = stepAds[step-1]?.code??globalAd;

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      <div className="glass border-b border-[rgba(0,191,255,0.1)] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white"/>
          </div>
          <span className="font-display font-bold text-sm text-white">NEON<span className="text-[#00BFFF]">LINK</span></span>
        </div>
        {info?.title&&(
          <div className="flex items-center gap-2 text-xs text-[#6B7280] max-w-xs truncate">
            <ExternalLink className="w-3 h-3"/><span className="truncate">{info.title}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-[#6B7280]">
          <Shield className="w-3 h-3 text-[#00FF88]"/><span className="hidden sm:inline">Secure</span>
        </div>
      </div>

      <div className="flex-1 p-4 py-6">
        <div className="w-full max-w-2xl mx-auto">

          {blocked===true&&(
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
              className="flex items-center gap-3 p-3 rounded-xl border border-yellow-400/30 bg-yellow-400/5 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0"/>
              <p className="text-xs text-[#9CA3AF] flex-1">مانع إعلانات مكتشف — أضف الموقع لقائمة الاستثناءات.</p>
              <button onClick={recheck} className="flex items-center gap-1 text-xs text-yellow-400 hover:underline">
                <RefreshCw className="w-3 h-3"/> تحقق
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {phase==="loading"&&(
              <motion.div key="l" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center py-16">
                <motion.div animate={{rotate:360}} transition={{duration:1.5,repeat:Infinity,ease:"linear"}}
                  className="w-10 h-10 border-2 border-[rgba(0,191,255,0.2)] border-t-[#00BFFF] rounded-full mx-auto mb-3"/>
                <p className="text-[#6B7280] text-sm">جاري التحميل…</p>
              </motion.div>
            )}
            {phase==="error"&&(
              <motion.div key="e" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                <div className="glass-card p-10 text-center">
                  <AlertCircle className="w-12 h-12 text-[#FF007F] mx-auto mb-4"/>
                  <h2 className="font-display text-xl font-bold text-white mb-2">رابط غير موجود</h2>
                  <p className="text-[#6B7280] text-sm mb-6">{error}</p>
                  <a href="/" className="btn-neon inline-flex items-center gap-2 px-6 py-3 rounded-xl">الرئيسية</a>
                </div>
              </motion.div>
            )}
            {phase==="password"&&(
              <motion.div key="p" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div className="glass-card p-10">
                  <PasswordForm slug={slug} onSuccess={()=>{
                    if(info&&info.adSteps>0)setPhase("steps");
                    else{setPhase("done");setTimeout(()=>{window.location.href=info!.originalUrl;},1200);}
                  }}/>
                </div>
              </motion.div>
            )}
            {phase==="steps"&&info&&(
              <ArticleStepCard
                key={step}
                step={step} total={info.adSteps}
                section={info.articleSections?.[step-1]??{title:"",content:""}}
                adCode={adCode}
                adTimer={info.adTimer}
                adBlocked={blocked===true}
                articleTitle={info.articleTitle||info.title||""}
                shareUrl={shareUrl}
                onNext={handleNext}
                isLast={step>=info.adSteps}
              />
            )}
            {phase==="done"&&(
              <motion.div key="d" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="text-center">
                <div className="glass-card p-10">
                  <motion.div animate={{scale:[1,1.2,1],opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center mx-auto mb-6">
                    <ExternalLink className="w-8 h-8 text-white"/>
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">جاري التحويل…</h2>
                  <p className="text-[#6B7280] text-sm">سيتم نقلك للرابط الآن.</p>
=======
// ─── Main Redirect Page ───────────────────────────────────────────────
export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [phase, setPhase] = useState<"loading" | "password" | "ads" | "redirecting" | "error">("loading");
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [stepState, setStepState] = useState<StepState>({ currentStep: 1, totalSteps: 3, sessionKey: "", completed: false });
  const [timeLeft, setTimeLeft] = useState(30);
  const [canContinue, setCanContinue] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Fetch link info
  useEffect(() => {
    async function fetchLink() {
      try {
        const res = await fetch(`/api/links/${slug}/info`);
        const data = await res.json();

        if (!data.success) {
          setError(data.error ?? "Link not found");
          setPhase("error");
          return;
        }

        setLinkInfo(data.data);

        if (data.data.hasPassword) {
          setPhase("password");
        } else if (data.data.adSteps > 0) {
          setStepState({
            currentStep: 1,
            totalSteps: data.data.adSteps,
            sessionKey: data.data.sessionKey,
            completed: false,
          });
          setTimeLeft(data.data.adTimer);
          setPhase("ads");
        } else {
          setPhase("redirecting");
          setTimeout(() => {
            window.location.href = data.data.originalUrl;
          }, 1500);
        }
      } catch {
        setError("Failed to load link");
        setPhase("error");
      }
    }
    fetchLink();
  }, [slug]);

  // Timer
  useEffect(() => {
    if (phase !== "ads" || canContinue) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanContinue(true);
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, canContinue, stepState.currentStep]);

  const handleContinue = useCallback(async () => {
    if (!canContinue || !linkInfo) return;
    const { currentStep, totalSteps, sessionKey } = stepState;

    if (currentStep >= totalSteps) {
      // Complete ad flow
      setPhase("redirecting");
      try {
        await fetch(`/api/links/${slug}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionKey }),
        });
      } catch {}
      setTimeout(() => {
        window.location.href = linkInfo.originalUrl;
      }, 1500);
    } else {
      // Next step
      setCanContinue(false);
      setTimeLeft(linkInfo.adTimer);
      setStepState(s => ({ ...s, currentStep: s.currentStep + 1 }));
    }
  }, [canContinue, linkInfo, slug, stepState]);

  // Get current ad
  const currentAd = linkInfo?.ads?.find(a =>
    a.placement === `STEP_${stepState.currentStep}` || a.placement === "GLOBAL"
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Top bar */}
      <div className="glass border-b border-[rgba(0,191,255,0.1)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm text-white">NEON<span className="text-[#00BFFF]">LINK</span></span>
        </div>
        {linkInfo?.title && (
          <div className="flex items-center gap-2 text-xs text-[#6B7280] max-w-xs truncate">
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{linkInfo.title}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-[#6B7280]">
          <Shield className="w-3 h-3 text-[#00FF88]" />
          <span className="hidden sm:inline">Secure Redirect</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* LOADING */}
            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-[rgba(0,191,255,0.2)] border-t-[#00BFFF] rounded-full mx-auto mb-4"
                />
                <p className="text-[#6B7280] text-sm">Loading link…</p>
              </motion.div>
            )}

            {/* ERROR */}
            {phase === "error" && (
              <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="glass-card p-10">
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(255,0,127,0.1)] border border-[rgba(255,0,127,0.3)] flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-[#FF007F]" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">Link Not Found</h2>
                  <p className="text-[#6B7280] text-sm mb-6">{error || "This link doesn't exist or has expired."}</p>
                  <a href="/" className="btn-neon inline-flex items-center gap-2 px-6 py-3 rounded-xl">
                    Go to NeonLink <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* PASSWORD */}
            {phase === "password" && (
              <motion.div key="password" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="glass-card p-10">
                  <PasswordForm slug={slug} onSuccess={() => {
                    if (linkInfo && linkInfo.adSteps > 0) {
                      setPhase("ads");
                    } else {
                      setPhase("redirecting");
                      setTimeout(() => { window.location.href = linkInfo!.originalUrl; }, 1500);
                    }
                  }} />
                </div>
              </motion.div>
            )}

            {/* AD STEPS */}
            {phase === "ads" && linkInfo && (
              <motion.div
                key={`step-${stepState.currentStep}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div className="glass-card p-6 md:p-8">
                  <ProgressSteps current={stepState.currentStep} total={stepState.totalSteps} />

                  <div className="text-center mb-6">
                    <p className="text-xs font-mono text-[#6B7280] uppercase tracking-widest mb-1">
                      Step {stepState.currentStep} of {stepState.totalSteps}
                    </p>
                    <h2 className="font-display text-xl font-bold text-white">
                      {canContinue ? "Ready to continue!" : "Please wait…"}
                    </h2>
                    <p className="text-sm text-[#6B7280] mt-1">
                      {canContinue
                        ? stepState.currentStep >= stepState.totalSteps
                          ? "Click below to be redirected to your destination"
                          : "Click continue for the next step"
                        : "View the ad below while the timer counts down"}
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="flex justify-center mb-6">
                    <CountdownRing seconds={timeLeft} total={linkInfo.adTimer} />
                  </div>

                  {/* Progress bar */}
                  <div className="progress-neon mb-6">
                    <motion.div
                      className="progress-neon-fill"
                      animate={{ width: `${((linkInfo.adTimer - timeLeft) / linkInfo.adTimer) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Ad slot */}
                  <AdSlot
                    code={currentAd?.code ?? ""}
                    label={`Advertisement - Step ${stepState.currentStep}`}
                  />

                  {/* Continue button */}
                  <div className="mt-6 text-center">
                    <motion.button
                      onClick={handleContinue}
                      disabled={!canContinue}
                      whileHover={canContinue ? { scale: 1.02 } : {}}
                      whileTap={canContinue ? { scale: 0.98 } : {}}
                      className={cn(
                        "px-10 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 mx-auto",
                        canContinue
                          ? "btn-neon shadow-[0_0_30px_rgba(0,191,255,0.3)]"
                          : "bg-white/5 border border-white/10 text-[#4B5563] cursor-not-allowed"
                      )}
                    >
                      {stepState.currentStep >= stepState.totalSteps ? (
                        <>Go to destination <ExternalLink className="w-4 h-4" /></>
                      ) : (
                        <>Continue <ChevronRight className="w-4 h-4" /></>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Anti-cheat notice */}
                <p className="text-center text-xs text-[#4B5563] mt-4">
                  <Shield className="w-3 h-3 inline mr-1 text-[#00FF88]" />
                  This redirect is protected. Bypassing is detected and blocked.
                </p>
              </motion.div>
            )}

            {/* REDIRECTING */}
            {phase === "redirecting" && (
              <motion.div key="redirecting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="glass-card p-10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center mx-auto mb-6"
                  >
                    <ExternalLink className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">Redirecting…</h2>
                  <p className="text-[#6B7280] text-sm">Taking you to your destination now.</p>
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Footer */}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      <div className="glass border-t border-[rgba(0,191,255,0.08)] p-3 text-center text-xs text-[#4B5563]">
        Powered by <a href="/" className="text-[#00BFFF] hover:underline">NeonLink</a>
      </div>
    </div>
  );
}
