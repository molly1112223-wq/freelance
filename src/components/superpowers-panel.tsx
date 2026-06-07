import { FileImage, Search, ShieldCheck, UploadCloud, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const powers = [
  {
    icon: FileImage,
    title: "先知道在为谁设计",
    description: "发布需求时先收集业务背景、目标页面、参考图和交付范围，不让设计师猜。"
  },
  {
    icon: Search,
    title: "把产品设计和品牌视觉分开处理",
    description: "搜索和标签围绕真实服务类型组织，后台 UI、设计系统、运营视觉不会混成一类。"
  },
  {
    icon: UploadCloud,
    title: "用作品阻断泛化承诺",
    description: "设计师用案例、方法和交付物回应需求，客户先看证据，再看报价。"
  },
  {
    icon: ShieldCheck,
    title: "把判断留在真实流程里",
    description: "报价、合约、交付物、验收和评价都留在同一条工作流，不靠线下聊天补上下文。"
  }
];

export function SuperpowersPanel() {
  return (
    <section className="container py-14">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <Badge>Impeccable Method</Badge>
          <h2 className="mt-5 max-w-sm text-3xl font-semibold leading-tight">把设计交易里最费力的判断前置</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
            不是堆更多按钮，而是让每个入口都服务于一个判断：这份需求是否清楚，这位设计师是否匹配，这次交付是否可控。
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
            <UsersRound size={16} />
            为中国设计服务场景收敛体验
          </div>
        </div>
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {powers.map((power, index) => {
            const Icon = power.icon;
            return (
              <div key={power.title} className="grid gap-4 py-5 md:grid-cols-[72px_1fr_44px] md:items-start">
                <div className="text-sm font-semibold text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h3 className="text-lg font-semibold">{power.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{power.description}</p>
                </div>
                <div className="grid size-11 place-items-center rounded-lg border border-[var(--border)] bg-[var(--accent-3)]">
                    <Icon size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
