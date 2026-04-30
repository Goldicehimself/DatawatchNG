import { ExternalLink, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard, SectionHeader } from "@/components/product/product-card";
import { problemProof, targetSegments } from "@/data/product";

export default function ProofPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-8 text-[#0A0A0A]">
      <div className="mx-auto max-w-[430px]">
        <ButtonLink href="/" variant="ghost" className="h-10 px-0">
          DataWatch NG
        </ButtonLink>

        <section className="mt-10">
          <SectionHeader
            eyebrow="Problem proof"
            title="Evidence this can become a trusted Nigerian product"
            body="The product is grounded in public telecom complaints, regulator activity, and observable prepaid user behavior."
          />
        </section>

        <div className="mt-8 grid gap-4">
          {problemProof.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <ProductCard>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-[#008751] uppercase">
                      {item.source}
                    </p>
                    <h2 className="mt-3 text-xl leading-7 font-bold">
                      {item.title}
                    </h2>
                  </div>
                  <ExternalLink
                    size={18}
                    strokeWidth={1.5}
                    className="mt-1 shrink-0 text-[#6B7280]"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                  {item.insight}
                </p>
              </ProductCard>
            </a>
          ))}
        </div>

        <section className="mt-10">
          <ProductCard>
            <Users size={26} strokeWidth={1.5} className="text-[#008751]" />
            <h2 className="mt-4 text-2xl font-bold">Target users</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              The first wedge is prepaid Nigerian mobile users, not the whole
              country at once.
            </p>
            <div className="mt-5 space-y-3">
              {targetSegments.map((segment) => (
                <div
                  key={segment}
                  className="rounded-[16px] bg-black/[0.04] p-4"
                >
                  <p className="text-sm font-semibold">{segment}</p>
                </div>
              ))}
            </div>
          </ProductCard>
        </section>
      </div>
    </main>
  );
}
