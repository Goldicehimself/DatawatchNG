import {
  ArrowRight,
  Bell,
  Bot,
  MessageCircle,
  Phone,
  Radar,
  Search,
  ShieldCheck,
  WalletCards,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/product/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";

const networkSet = ["airtel", "Glo", "9mobile", "MTN"];

const featureCards = [
  {
    title: "Fraud Detection",
    body: "Detect unauthorized charges instantly.",
    icon: ShieldCheck,
  },
  {
    title: "Live Data Tracking",
    body: "See every MB in real time.",
    icon: Wifi,
  },
  {
    title: "Watcher AI",
    body: "Understand your usage in English or Pidgin.",
    icon: Bot,
  },
  {
    title: "Instant Alerts",
    body: "Get notified when something changes.",
    icon: Bell,
  },
];

const insights = [
  "Most data usage occurs in the evening (6-10PM)",
  "YouTube and Instagram are top consumers across networks",
  "Background apps contribute up to 28% unseen usage",
  "Average unnoticed loss: N800-N2,500/month",
];

const liveMessages = [
  "New anomaly detected in your area...",
  "Scanning MTN VAS subscriptions...",
  "Watcher is analyzing your usage...",
  "Live pattern update from Lagos users...",
  "Cross-checking unknown charges...",
];

const networkClasses: Record<string, string> = {
  airtel: "bg-[#E60012] text-white",
  Glo: "bg-[#008751] text-white",
  "9mobile": "bg-[#006B3F] text-white",
  MTN: "bg-[#FFCC00] text-black",
};

export default function LandingPage() {
  const whatsappHref = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(env.NEXT_PUBLIC_WHATSAPP_PREFILL)}`;

  return (
    <main className="landing-page bg-[#F6F6F4] text-[#050505] dark:bg-[#020805] dark:text-[#F4FFF9]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#F7F7F5] dark:bg-[#07110D]">
        <section className="landing-hero relative min-h-[620px] overflow-hidden bg-black px-5 pt-5 pb-12 text-white">
          <div className="absolute inset-0">
            {[
              "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
            ].map((src, index) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                loading="eager"
                priority={index === 0}
                sizes="430px"
                className={`hero-slide hero-slide-${index + 1} object-cover`}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.42)_38%,rgba(0,0,0,0.88))]" />
          </div>
          <nav className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#008751] shadow-lg">
                <Image
                  src="/datawatchimg-removebg-preview.png"
                  alt="DataWatch NG"
                  width={26}
                  height={26}
                  className="h-6 w-6 object-contain"
                  style={{ width: "100%", height: "100%" }}
                />
              </span>
              <div className="leading-none">
                <p className="text-sm font-black">DataWatch</p>
                <p className="text-[10px] font-semibold text-white/70">NG</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ButtonLink
                href="/auth?mode=signin"
                className="h-9 rounded-full bg-white/12 px-5 text-xs text-white backdrop-blur"
              >
                Sign in
              </ButtonLink>
            </div>
          </nav>

          <div className="relative z-10 mt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#008751]/70 px-3 py-2 text-[10px] font-black tracking-[0.1em] uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5CFFB2]" />
              Live telecom intelligence
            </span>
            <h1 className="mt-6 text-[43px] leading-[0.93] font-black tracking-[-0.055em]">
              Your data is <span className="text-[#00D37F]">disappearing.</span>
              <br />
              We know why.
            </h1>
            <p className="mt-5 max-w-[330px] text-sm leading-6 font-medium text-white/82">
              DataWatch tracks every MB, catches unauthorized charges, and
              explains it all to every Nigerian, on any network.
            </p>
            <p className="mt-4 text-xs font-bold text-white/60">
              No password. Just your phone number.
            </p>
            <div className="mt-8 grid gap-3">
              <ButtonLink
                href="/auth"
                className="h-14 rounded-[13px] bg-white text-base font-black text-black"
              >
                Get started
                <ArrowRight size={16} strokeWidth={1.8} />
              </ButtonLink>
              <ButtonLink
                href="/demo"
                variant="secondary"
                className="h-14 rounded-[13px] border-white/20 bg-white/10 text-base font-black text-white backdrop-blur"
              >
                Try the live demo
              </ButtonLink>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            <span className="h-1.5 w-5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
          </div>
        </section>

        <section className="landing-surface border-b border-black/[0.05] bg-white py-5">
          <p className="text-center text-[9px] font-black tracking-[0.34em] text-[#6B7280] uppercase">
            Works across all major Nigerian networks
          </p>
          <div className="hide-scrollbar mt-4 overflow-hidden">
            <div className="network-marquee flex w-max gap-8 px-5">
              {[...networkSet, ...networkSet].map((network, index) => (
                <span
                  key={`${network}-${index}`}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${networkClasses[network]}`}
                >
                  {network}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-7">
          <div className="landing-card live-message-pill rounded-full bg-white px-5 py-4 text-xs font-semibold text-[#4B5563] shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#008751]" />
            <span className="live-message-text" aria-live="polite">
              {liveMessages.map((message, index) => (
                <span
                  key={message}
                  className={`live-message live-message-${index + 1}`}
                >
                  {message}
                </span>
              ))}
            </span>
          </div>
        </section>

        <section className="px-5 py-5">
          <p className="text-[10px] font-black tracking-[0.28em] text-[#008751] uppercase">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Three steps. Under a minute.
          </h2>
          <div className="landing-scroll-edge -mx-5 mt-5">
            <div className="landing-horizontal-scroll hide-scrollbar flex gap-4 overflow-x-auto px-5 pb-3">
              {[
                ["Step 01", "Enter your details", "Add your name and Nigerian mobile number."],
                ["Step 02", "Create your PIN", "Choose a secure 4-digit PIN for fast sign in."],
                ["Step 03", "Confirm with OTP", "Verify once, then start tracking instantly."],
              ].map(([step, title, body]) => (
                <div
                  key={step}
                  className="landing-card landing-scroll-item min-w-[224px] rounded-[18px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#008751] uppercase">
                    {step}
                  </p>
                  <h3 className="mt-4 text-base font-black">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#6B7280]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-5">
          <p className="text-[10px] font-black tracking-[0.28em] text-[#008751] uppercase">
            Explore
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            What you can do in DataWatch
          </h2>
          <div className="landing-scroll-edge -mx-5 mt-5">
            <div className="landing-horizontal-scroll hide-scrollbar flex gap-3 overflow-x-auto px-5 pb-3">
              {[
                ["Check Usage", Radar],
                ["Detect Charges", Search],
                ["Scan Subscriptions", WalletCards],
                ["Ask Watcher", Bot],
              ].map(([label, Icon]) => (
                <div
                  key={String(label)}
                  className="landing-card landing-scroll-item flex shrink-0 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#008751]/10 text-[#008751]">
                    <Icon size={15} strokeWidth={1.7} />
                  </span>
                  {String(label)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-5">
          <p className="text-[10px] font-black tracking-[0.28em] text-[#008751] uppercase">
            Why DataWatch
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Built for every Nigerian line
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="landing-card rounded-[18px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#008751]/10 text-[#008751]">
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 text-sm font-black">{feature.title}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-[#6B7280]">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-6">
          <p className="text-[10px] font-black tracking-[0.28em] text-[#008751] uppercase">
            Live preview
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Your line, at a glance
          </h2>
          <div className="landing-card mt-5 overflow-hidden rounded-[24px] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="landing-surface flex justify-center bg-[#FAFAFA] pt-5">
              <Image
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=650&q=80"
                alt="Phone showing data usage dashboard"
                width={192}
                height={224}
                className="h-56 w-48 rounded-[28px] object-cover shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-black">Your Line Overview</h3>
                <span className="text-[10px] font-bold text-[#008751]">
                  Live tracking enabled
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Data used today", "2.4GB"],
                  ["Peak usage", "6-10PM"],
                  ["Active apps", "YouTube, WA, IG"],
                  ["Status", "Monitoring"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[14px] bg-black/[0.04] p-4">
                    <p className="text-[10px] font-bold tracking-wide text-[#6B7280] uppercase">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-black text-[#008751]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-[#6B7280]">Updated just now</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-6">
          <p className="text-[10px] font-black tracking-[0.28em] text-[#008751] uppercase">
            Network insights
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            What we&apos;re seeing across Nigeria
          </h2>
          <div className="mt-5 grid gap-3">
            {insights.map((insight, index) => (
              <div
                key={insight}
                className="landing-card flex items-center gap-4 rounded-[18px] bg-white p-4 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-xs font-bold text-[#6B7280]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-6">{insight}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-6">
          <p className="text-[10px] font-black tracking-[0.28em] text-[#008751] uppercase">
            Support
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Chat with Watcher on WhatsApp
          </h2>
          <div className="landing-card mt-5 rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-[0_22px_58px_rgba(15,23,42,0.11)]">
            <div className="overflow-hidden rounded-[18px] border border-black/[0.08] bg-[#F3F0EA]">
              <div className="flex items-center gap-3 bg-[#075E54] p-4 text-white shadow-[0_8px_22px_rgba(7,94,84,0.18)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#075E54] shadow-sm">
                  <MessageCircle size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-sm font-black">Watcher - DataWatch NG</p>
                  <p className="text-xs font-semibold text-white/80">online</p>
                </div>
              </div>
              <div className="space-y-3 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(230,221,212,0.52))] p-4 text-xs font-medium text-[#111827]">
                <p className="max-w-[78%] rounded-[16px] bg-white p-3 shadow-[0_6px_14px_rgba(15,23,42,0.08)]">
                  Hi Tunde. Your MTN line used 2.4GB today.
                </p>
                <p className="ml-auto max-w-[70%] rounded-[16px] bg-[#DCF8C6] p-3 shadow-[0_6px_14px_rgba(15,23,42,0.08)]">
                  Wetin chop am?
                </p>
                <p className="max-w-[82%] rounded-[16px] bg-white p-3 shadow-[0_6px_14px_rgba(15,23,42,0.08)]">
                  YouTube 1.2GB, Instagram 480MB, Background 320MB.
                </p>
                <p className="ml-auto max-w-[70%] rounded-[16px] bg-[#DCF8C6] p-3 shadow-[0_6px_14px_rgba(15,23,42,0.08)]">
                  Any wahala?
                </p>
                <p className="max-w-[82%] rounded-[16px] bg-white p-3 shadow-[0_6px_14px_rgba(15,23,42,0.08)]">
                  Yes, N475 charged by Beatz Africa. You no subscribe. Reply
                  STOP to cancel.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle size={18} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-sm font-black">
                  Get instant help in English or Pidgin
                </p>
                <p className="text-xs text-[#6B7280]">
                  Your AI data analyst, right inside WhatsApp.
                </p>
              </div>
            </div>
            <ButtonLink href={whatsappHref} className="mt-5 w-full rounded-[14px]">
              <Phone size={16} strokeWidth={1.7} />
              Open WhatsApp
            </ButtonLink>
          </div>
        </section>

        <section className="px-5 py-8">
          <div className="rounded-[28px] bg-gradient-to-br from-[#008751] to-[#00653E] p-7 text-center text-white shadow-[0_26px_70px_rgba(0,92,53,0.26)]">
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-white/30 bg-white/10 shadow-[0_20px_48px_rgba(0,0,0,0.16)]">
              <Image
                src="/fac.webp"
                alt="Social apps consuming mobile data"
                fill
                sizes="96px"
                className="object-cover object-center"
              />
            </div>
            <h2 className="mx-auto mt-8 max-w-[260px] text-3xl leading-tight font-black tracking-[-0.04em]">
              Track your data like you track your food orders.
            </h2>
            <p className="mt-3 text-sm text-white/75">
              Real-time usage. Instant alerts. Full transparency.
            </p>
            <div className="mt-7 grid gap-3">
              <ButtonLink href="/auth" className="bg-white text-[#005C35]">
                Get Started Free
                <ArrowRight size={16} strokeWidth={1.8} />
              </ButtonLink>
              <ButtonLink
                href="/demo"
                variant="secondary"
                className="border-white/20 bg-white/12 text-white"
              >
                Try Demo
              </ButtonLink>
            </div>
          </div>
        </section>

        <footer className="px-5 pb-8 text-center text-[10px] text-[#6B7280]">
          Made in Lagos · DataWatch NG · 2026
        </footer>
      </div>
    </main>
  );
}
