import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const scenes = [
  {
    step: "01",
    title: "客户发布图文 brief",
    description: "文字说明、参考图、预算和技能标签进入同一份需求。",
    image: "/showcase/color-brand-web.svg",
    label: "Brief"
  },
  {
    step: "02",
    title: "设计师用作品回应",
    description: "客户先看风格和方法，再判断报价是否匹配。",
    image: "/showcase/color-commerce.svg",
    label: "Portfolio"
  },
  {
    step: "03",
    title: "进入合约与交付",
    description: "报价、合约、交付物和验收保持在同一条工作流里。",
    image: "/showcase/color-service.svg",
    label: "Delivery"
  }
];

export function HyperframesFlow() {
  return (
    <section className="container py-14">
      <div className="surface-slab overflow-hidden p-0">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-b border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] p-6 md:p-8 lg:border-b-0 lg:border-r">
            <Badge>Motion Flow</Badge>
            <h2 className="mt-5 max-w-sm text-3xl font-semibold leading-tight">把设计协作做成一条清晰分镜</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
              参考 HyperFrames 的分镜节奏，页面不追求炫技，只让客户和设计师看清下一步该做什么。
            </p>
            <div className="mt-8 h-px overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--border))]">
              <div className="h-full bg-[var(--button-bg)] animate-timeline-progress" />
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {scenes.map((scene) => (
                <div key={scene.step} className="flex items-center gap-3 text-[var(--muted)]">
                  <CheckCircle2 size={16} className="text-[var(--foreground)]" />
                  <span>{scene.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-3">
            {scenes.map((scene, index) => (
              <div
                key={scene.step}
                className="group relative min-h-[340px] overflow-hidden border-b border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--card)] last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <div className="absolute inset-0 opacity-80">
                  <Image
                    src={scene.image}
                    alt={`${scene.title} 画面`}
                    fill
                    className="object-cover animate-frame-pan"
                    style={{ animationDelay: `${index * 900}ms` }}
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_18%,transparent),var(--card)_86%)]" />
                <div className="relative flex min-h-[340px] flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)]">{scene.step}</span>
                    <Badge>{scene.label}</Badge>
                  </div>
                  <div className="animate-marker-rise" style={{ animationDelay: `${index * 600}ms` }}>
                    <h3 className="text-xl font-semibold leading-tight">{scene.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{scene.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                      下一步
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
