import { CheckCircle2, Link2, MessageCircle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";

const flows = [
  "Tap Chat with Watcher, click a wa.me link, or scan a QR code",
  "WhatsApp opens with the message: Hi Watcher, check my data",
  "User sends the message and consent-based support begins",
  "WhatsApp Business provides the user's WhatsApp ID phone number",
  "DataWatch maps that phone number to the verified app account",
];

export default function WhatsAppPage() {
  const whatsappHref = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(env.NEXT_PUBLIC_WHATSAPP_PREFILL)}`;

  return (
    <AppShell>
      <p className="text-sm font-semibold text-[#008751]">WhatsApp Watcher</p>
      <h1 className="mt-2 text-3xl font-semibold">
        Support where users already are
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
        WhatsApp Watcher uses standard WhatsApp Business behavior. There is no
        hidden tracking, no contact scraping, and no background access.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ProductCard className="bg-gradient-to-br from-[#008751] to-[#005C35] text-white">
          <MessageCircle size={30} strokeWidth={1.5} />
          <h2 className="mt-5 text-2xl font-semibold">Chat with Watcher</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Instant AI support via WhatsApp, mapped to the app after the user
            sends the first message.
          </p>
          <ButtonLink
            href={whatsappHref}
            className="mt-6 bg-white text-[#005C35]"
          >
            Open WhatsApp
          </ButtonLink>
        </ProductCard>

        <ProductCard>
          <h2 className="font-semibold">Identity mapping flow</h2>
          <div className="mt-5 space-y-4">
            {flows.map((flow, index) => (
              <div key={flow} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#008751]/10 text-xs font-semibold text-[#008751]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[#6B7280]">{flow}</p>
              </div>
            ))}
          </div>
        </ProductCard>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Consent-based", icon: CheckCircle2 },
          { title: "Phone ID mapping", icon: Link2 },
          { title: "Business API ready", icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <ProductCard key={item.title}>
              <Icon size={23} strokeWidth={1.5} className="text-[#008751]" />
              <p className="mt-4 text-sm font-semibold">{item.title}</p>
            </ProductCard>
          );
        })}
      </div>
    </AppShell>
  );
}
