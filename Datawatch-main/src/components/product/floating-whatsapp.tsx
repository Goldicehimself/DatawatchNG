import { env } from "@/config/env";

export function FloatingWhatsApp() {
  const href = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(env.NEXT_PUBLIC_WHATSAPP_PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Watcher on WhatsApp"
      className="fixed right-5 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#008751] text-white shadow-[0_16px_40px_rgba(0,135,81,0.35)] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#008751]/25 focus-visible:outline-none"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-current"
      >
        <path d="M16.02 3.2A12.7 12.7 0 0 0 5.18 22.5L3.6 28.8l6.44-1.52A12.68 12.68 0 1 0 16.02 3.2Zm0 2.28a10.4 10.4 0 0 1 8.86 15.86 10.4 10.4 0 0 1-13.94 3.76l-.46-.24-3.54.84.86-3.44-.28-.48A10.42 10.42 0 0 1 16.02 5.48Zm-4.46 4.94c-.22 0-.56.08-.86.4-.3.34-1.14 1.12-1.14 2.72 0 1.6 1.16 3.14 1.32 3.36.16.22 2.24 3.58 5.54 4.88 2.74 1.08 3.3.86 3.9.8.6-.06 1.94-.78 2.22-1.56.28-.76.28-1.42.2-1.56-.08-.14-.3-.22-.62-.38-.32-.16-1.94-.96-2.24-1.06-.3-.12-.52-.16-.74.16-.22.32-.84 1.06-1.04 1.28-.18.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.86-1.6-1.92-1.78-2.24-.18-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.18.22-.32.32-.54.1-.22.06-.4-.02-.56-.08-.16-.74-1.78-1.02-2.44-.26-.64-.54-.54-.74-.56h-.62Z" />
      </svg>
    </a>
  );
}
