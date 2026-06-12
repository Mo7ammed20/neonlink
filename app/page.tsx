"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Zap, BarChart3, Shield, Globe, QrCode, Lock,
  ChevronDown, Star, ArrowRight, Copy, Check,
  Users, Link2, MousePointerClick, TrendingUp, Menu, X
} from "lucide-react";
import { ParticleBackground } from "@/components/particles/ParticleBackground";
import { cn, formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

// ─── Animated Counter ────────────────────────────────────────────────
function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{formatNumber(count)}</span>;
}

// ─── FAQ Accordion ──────────────────────────────────────────────────
const faqs = [
  { q: "How does NeonLink work?", a: "Paste your long URL, click Shorten, and instantly get a compact link. Share it anywhere — NeonLink tracks every click with full geographic and device analytics." },
  { q: "Can I earn money from my links?", a: "Yes. NeonLink's monetization system shows ads to visitors before redirecting them. You earn revenue per completed ad view, paid directly to your account." },
  { q: "Are the links permanent?", a: "Free links never expire. You can optionally set expiration dates, click limits, or deactivate links at any time from your dashboard." },
  { q: "Is there an API?", a: "Absolutely. NeonLink provides a full REST API with developer keys, rate limiting, and endpoints for shortening, analytics retrieval, and bulk operations." },
  { q: "What analytics do I get?", a: "Every click is tracked by country, city, device, browser, OS, referrer, and time. View beautiful charts broken down by day, week, or month." },
  { q: "Can I use a custom domain?", a: "Pro and Business plans support custom domains. Point your domain to NeonLink and all your short links will use your own brand." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
          >
            <span className="font-semibold text-[#F0F4FF]">{faq.q}</span>
            <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-[#00BFFF] flex-shrink-0" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Hero URL Shortener Form ────────────────────────────────────────
function HeroShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleShorten(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ shortUrl: data.data.shortUrl });
        toast.success("Link shortened!");
      } else {
        toast.error(data.error ?? "Something went wrong");
      }
    } catch {
      toast.error("Failed to shorten. Check your URL.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass rounded-3xl p-8 border border-[rgba(0,191,255,0.2)] shadow-[0_0_60px_rgba(0,191,255,0.08)]">
      <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            required
            className="w-full rounded-xl pl-12 pr-4 py-4 outline-none transition-all duration-300 bg-black/40 border border-[rgba(0,191,255,0.2)] text-[#F0F4FF] placeholder-[#4B5563] focus:border-[#00BFFF] focus:shadow-[0_0_0_3px_rgba(0,191,255,0.1),0_0_20px_rgba(0,191,255,0.1)] font-body text-base"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-neon px-8 py-4 rounded-xl font-semibold text-base whitespace-nowrap flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Shortening...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Shorten
            </>
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 flex items-center gap-3 p-4 rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)]"
          >
            <div className="flex-1 font-mono text-[#00FF88] text-sm break-all">
              {result.shortUrl}
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00FF88] text-sm font-medium hover:bg-[rgba(0,255,136,0.15)] transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-xs text-[#4B5563] text-center">
        No account required for basic shortening. <Link href="/register" className="text-[#00BFFF] hover:underline">Sign up free</Link> for analytics, QR codes, and monetization.
      </p>
    </div>
  );
}

// ─── Features ────────────────────────────────────────────────────────
const features = [
  { icon: BarChart3, title: "Deep Analytics", desc: "Track every click — country, device, browser, referrer, time. Beautiful real-time charts.", color: "#00BFFF" },
  { icon: TrendingUp, title: "Ad Monetization", desc: "3-step ad system with countdown timer. Earn per click with Google AdSense, PropellerAds, and more.", color: "#8A2BE2" },
  { icon: QrCode, title: "QR Code Generator", desc: "Instant QR code for every link. Download as PNG, embed anywhere, perfect for print.", color: "#FF007F" },
  { icon: Lock, title: "Password Protection", desc: "Lock sensitive links behind a password. Control who can access your redirects.", color: "#00FF88" },
  { icon: Globe, title: "Geo Analytics", desc: "Interactive world map showing traffic distribution across countries and cities.", color: "#FFD700" },
  { icon: Shield, title: "Enterprise Security", desc: "Rate limiting, bot detection, CSRF/XSS protection, audit logs, and IP tracking.", color: "#FF6B6B" },
];

// ─── Testimonials ────────────────────────────────────────────────────
const testimonials = [
  { name: "Sarah Chen", role: "Content Creator", text: "NeonLink's analytics helped me understand exactly where my traffic comes from. The ad earnings are a game changer.", avatar: "SC" },
  { name: "Marcus Rivera", role: "Growth Marketer", text: "Switched from Bitly and never looked back. The dashboard is beautiful and the data depth is unmatched.", avatar: "MR" },
  { name: "Priya Kapoor", role: "SaaS Founder", text: "We use NeonLink's API to manage thousands of campaign links. Rock solid performance and brilliant support.", avatar: "PK" },
];

// ─── Pricing ────────────────────────────────────────────────────────
const plans = [
  { name: "Free", price: 0, features: ["50 links/month", "Basic analytics", "QR codes", "7-day history"], popular: false },
  { name: "Pro", price: 9, features: ["Unlimited links", "Full analytics", "Custom alias", "Password protection", "API access", "30-day history", "Bulk shortening"], popular: true },
  { name: "Business", price: 29, features: ["Everything in Pro", "Custom domain", "Team members", "White-label", "Priority support", "1-year history", "Advanced monetization"], popular: false },
];

// ─── Navbar ──────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "py-3 glass border-b border-[rgba(0,191,255,0.1)]" : "py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-wide">NEON<span className="text-[#00BFFF]">LINK</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Analytics", "Pricing", "API"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-[#6B7280] hover:text-white transition-colors font-medium">
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-[#6B7280] hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/register">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-neon px-5 py-2.5 text-sm rounded-xl">
              Get Started
            </motion.button>
          </Link>
        </div>

        <button className="md:hidden p-2 text-[#6B7280] hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[rgba(0,191,255,0.1)] px-4 py-4 space-y-3"
          >
            {["Features", "Analytics", "Pricing", "API"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-sm text-[#6B7280] hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-[rgba(0,191,255,0.3)] rounded-xl text-[#00BFFF] hover:bg-[rgba(0,191,255,0.1)]">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 text-center py-2.5 text-sm font-semibold btn-neon rounded-xl">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] overflow-x-hidden">
      <ParticleBackground />
      <div className="grid-bg fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.5 }} />
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00BFFF] rounded-full filter blur-[150px] opacity-5 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#8A2BE2] rounded-full filter blur-[150px] opacity-5 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="badge-neon mb-6 inline-flex">
              <Zap className="w-3 h-3" /> Powered by AI Analytics
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-tight tracking-tight mb-6"
          >
            <span className="text-white">Shorten.</span>{" "}
            <span className="text-gradient-animated">Track.</span>{" "}
            <span className="text-white">Monetize.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The URL shortener that pays you back. Deep analytics, ad monetization, and a cyber-grade dashboard to rule your links.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <HeroShortener />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Link2, value: 12000000, label: "Links Created", suffix: "+" },
              { icon: MousePointerClick, value: 850000000, label: "Total Clicks", suffix: "+" },
              { icon: Users, value: 185000, label: "Active Users", suffix: "+" },
              { icon: TrendingUp, value: 2400000, label: "Revenue Paid", suffix: "$", prefix: "" },
            ].map(({ icon: Icon, value, label, suffix }, i) => (
              <div key={i} className="glass-card text-center py-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,191,255,0.1)] border border-[rgba(0,191,255,0.2)] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <div className="font-display text-2xl font-bold text-white">
                  {i === 3 && "$"}<Counter end={value} />{suffix}
                </div>
                <div className="text-xs text-[#6B7280] mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="badge-neon mb-4 inline-flex">Features</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to<br /><span className="text-gradient">dominate your links</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="badge-neon mb-4 inline-flex">Pricing</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-[#6B7280]">Start free. Upgrade when you&rsquo;re ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass-card relative",
                  plan.popular && "border-[rgba(0,191,255,0.4)] shadow-[0_0_40px_rgba(0,191,255,0.15)]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-neon text-xs px-3 py-1">
                    Most Popular
                  </div>
                )}
                <div className="text-[#6B7280] text-sm mb-2">{plan.name}</div>
                <div className="font-display text-4xl font-bold text-white mb-1">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-lg font-normal text-[#6B7280]">/mo</span>}
                </div>
                <div className="divider-neon my-5" />
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#00FF88] flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className={cn(
                    "w-full py-3 rounded-xl font-semibold text-sm transition-all",
                    plan.popular ? "btn-neon" : "btn-ghost"
                  )}>
                    {plan.price === 0 ? "Start Free" : `Get ${plan.name}`}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Loved by link builders</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  ))}
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center font-bold text-sm text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-[#6B7280]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
          </motion.div>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-[rgba(0,191,255,0.2)] shadow-[0_0_80px_rgba(0,191,255,0.08)]"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to take control of your links?
            </h2>
            <p className="text-[#6B7280] mb-8 text-lg">Join 185,000+ creators, marketers, and developers.</p>
            <Link href="/register">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-neon px-10 py-4 text-lg rounded-2xl inline-flex items-center gap-2">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[rgba(0,191,255,0.08)] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-white">NEON<span className="text-[#00BFFF]">LINK</span></span>
          </div>
          <p className="text-xs text-[#4B5563]">© 2026 NeonLink. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "API Docs"].map((item) => (
              <Link key={item} href="#" className="text-xs text-[#4B5563] hover:text-[#00BFFF] transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
