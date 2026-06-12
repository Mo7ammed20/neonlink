"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, SkipForward, Clock, BookOpen,
  Facebook, Twitter, Send, MessageCircle, Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────
export interface ArticlePage {
  title: string;
  content: string;
}

interface AdEntry { id: string; code: string; placement: string; }

interface Props {
  articleTitle: string;
  pages: ArticlePage[];
  ads: AdEntry[];
  adTimer: number;
  pageUrl: string;
  adBlockDetected: boolean;
  onComplete: () => void;
}

// ─── Banner Ad inside article ─────────────────────────────────────────
function ArticleAdBanner({ code, adBlockDetected }: { code: string; adBlockDetected: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !code || adBlockDetected) return;
    const el = ref.current;
    el.innerHTML = "";
    const t = setTimeout(async () => {
      try {
        el.innerHTML = code;
        const ext = Array.from(el.querySelectorAll<HTMLScriptElement>("script[src]"));
        const inl = Array.from(el.querySelectorAll<HTMLScriptElement>("script:not([src])"));
        for (const old of ext) {
          await new Promise<void>(res => {
            const ns = document.createElement("script");
            Array.from(old.attributes).forEach(a => ns.setAttribute(a.name, a.value));
            ns.onload = () => res(); ns.onerror = () => res();
            old.parentNode?.replaceChild(ns, old);
          });
        }
        for (const old of inl) {
          const ns = document.createElement("script");
          Array.from(old.attributes).forEach(a => ns.setAttribute(a.name, a.value));
          ns.textContent = old.textContent;
          old.parentNode?.replaceChild(ns, old);
          await new Promise(r => setTimeout(r, 10));
        }
      } catch { /* silent */ }
    }, 120);
    return () => clearTimeout(t);
  }, [code, adBlockDetected]);

  if (!code) return null;

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-white/10 bg-white/2">
      <p className="text-center text-[10px] text-[#4B5563] py-1 border-b border-white/5 uppercase tracking-widest">
        Advertisement
      </p>
      {adBlockDetected
        ? <div className="flex items-center justify-center gap-2 py-5 text-yellow-400/60 text-xs">⚠ الإعلان محجوب — يرجى تعطيل مانع الإعلانات</div>
        : <div ref={ref} style={{ minHeight: 90, width: "100%", overflow: "hidden" }} />
      }
    </div>
  );
}

// ─── Social Bar ───────────────────────────────────────────────────────
function SocialBar({ url, title }: { url: string; title: string }) {
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(title);
  const btns = [
    { label: "Facebook",    Icon: Facebook,       bg: "bg-[#1877F2]", href: `https://www.facebook.com/sharer/sharer.php?u=${eu}` },
    { label: "X / Twitter", Icon: Twitter,         bg: "bg-[#0F1419]", href: `https://twitter.com/intent/tweet?url=${eu}&text=${et}` },
    { label: "WhatsApp",    Icon: MessageCircle,   bg: "bg-[#25D366]", href: `https://wa.me/?text=${et}%20${eu}` },
    { label: "Telegram",    Icon: Send,             bg: "bg-[#2CA5E0]", href: `https://t.me/share/url?url=${eu}&text=${et}` },
  ];
  return (
    <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-white/5">
      <Share2 className="w-3.5 h-3.5 text-[#6B7280]" />
      <span className="text-xs text-[#6B7280]">شارك:</span>
      {btns.map(b => (
        <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" title={b.label}
          className={`w-8 h-8 rounded-full ${b.bg} flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform`}>
          <b.Icon className="w-3.5 h-3.5" />
        </a>
      ))}
    </div>
  );
}

// ─── Article Slider ───────────────────────────────────────────────────
export function ArticleSlider({
  articleTitle, pages, ads, adTimer, pageUrl, adBlockDetected, onComplete,
}: Props) {
  const total = pages.length;
  const [current, setCurrent]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(adTimer);
  const [canNext, setCanNext]   = useState(false);
  const [skipLeft, setSkipLeft] = useState(5);
  const mainRef = useRef<ReturnType<typeof setInterval>>();
  const skipRef = useRef<ReturnType<typeof setInterval>>();
  const isLast = current === total - 1;

  // Sequential: 1st step slot → index 0, etc.
  const stepAds = ads.filter(a => a.placement?.startsWith("STEP_"));
  const ad = stepAds[current] ?? ads.find(a => a.placement === "GLOBAL");

  // Reset timers on page change
  useEffect(() => {
    setTimeLeft(adTimer); setCanNext(false); setSkipLeft(5);
    clearInterval(mainRef.current); clearInterval(skipRef.current);

    mainRef.current = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { setCanNext(true); clearInterval(mainRef.current); return 0; } return p - 1; });
    }, 1000);

    skipRef.current = setInterval(() => {
      setSkipLeft(p => { if (p <= 1) { clearInterval(skipRef.current); return 0; } return p - 1; });
    }, 1000);

    return () => { clearInterval(mainRef.current); clearInterval(skipRef.current); };
  }, [current, adTimer]);

  const goNext  = useCallback(() => { if (!canNext)    return; isLast ? onComplete() : setCurrent(p => p + 1); }, [canNext, isLast, onComplete]);
  const doSkip  = useCallback(() => { if (skipLeft > 0) return; isLast ? onComplete() : setCurrent(p => p + 1); }, [skipLeft, isLast, onComplete]);

  return (
    <div className="w-full space-y-4">

      {/* ── Header ── */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-[#00BFFF]" />
          <span className="text-xs font-mono text-[#6B7280] uppercase tracking-widest">
            الصفحة {current + 1} من {total}
          </span>
        </div>
        <h1 className="font-display text-lg font-bold text-white leading-snug">{articleTitle}</h1>
        {/* Step progress bars */}
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={cn(
              "h-1.5 rounded-full transition-all duration-500 flex-1",
              i < current    ? "bg-[#00FF88]"
              : i === current ? "bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2]"
              : "bg-white/10"
            )} />
          ))}
        </div>
      </div>

      {/* ── Article content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-base font-semibold text-white mb-4 pb-3 border-b border-white/10">
            {pages[current].title}
          </h2>

          {/* Article text */}
          <div
            className="text-[#9CA3AF] text-sm leading-relaxed"
            style={{ direction: "rtl" }}
            dangerouslySetInnerHTML={{ __html: pages[current].content }}
          />

          {/* ── Banner ad embedded in article ── */}
          {ad && <ArticleAdBanner code={ad.code} adBlockDetected={adBlockDetected} />}

          {/* ── Social Bar ── */}
          <SocialBar url={pageUrl} title={articleTitle} />
        </motion.div>
      </AnimatePresence>

      {/* ── Timer + Navigation ── */}
      <div className="glass-card p-4 flex items-center gap-3">

        {/* Timer info */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <Clock className={cn("w-4 h-4", canNext ? "text-[#00FF88]" : "text-[#6B7280]")} />
          {canNext ? (
            <span className="text-sm text-[#00FF88] font-semibold">جاهز!</span>
          ) : (
            <span className="text-lg font-bold text-white font-mono">{timeLeft}s</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2]"
            animate={{ width: `${((adTimer - timeLeft) / adTimer) * 100}%` }}
            transition={{ duration: 0.5 }} />
        </div>

        {/* Skip button — unlocks after 5 s */}
        <button onClick={doSkip} disabled={skipLeft > 0}
          className={cn("flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all flex-shrink-0",
            skipLeft > 0
              ? "text-[#4B5563] cursor-not-allowed"
              : "text-[#6B7280] hover:text-white hover:bg-white/10 border border-white/10"
          )}>
          <SkipForward className="w-3.5 h-3.5" />
          {skipLeft > 0 ? `تخطي (${skipLeft})` : "تخطي"}
        </button>

        {/* Next / Finish button — unlocks when timer hits 0 */}
        <motion.button onClick={goNext} disabled={!canNext}
          whileHover={canNext ? { scale: 1.04 } : {}} whileTap={canNext ? { scale: 0.97 } : {}}
          className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0",
            canNext
              ? "btn-neon"
              : "bg-white/5 border border-white/10 text-[#4B5563] cursor-not-allowed"
          )}>
          {isLast ? "انتقل للرابط" : "التالي"}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

    </div>
  );
}
