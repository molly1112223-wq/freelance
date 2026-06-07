import Image from "next/image";
import { redirect } from "next/navigation";
import { CalendarDays, FileCheck2, FolderKanban, MessageSquareText, Star, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { formatMoney, formatProjectStatus } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { toProject } from "@/lib/project-mappers";

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "freelancer") redirect("/dashboard/freelancer");

  const dbProjects = await prisma.project.findMany({
    where: { clientId: user.id },
    include: {
      client: { select: { name: true } },
      contract: { include: { deliverables: true, reviews: true } },
      proposals: {
        include: { freelancer: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" }
      },
      _count: { select: { proposals: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  const projects = dbProjects.map(toProject);
  const proposalTotal = dbProjects.reduce((total, project) => total + project.proposals.length, 0);
  const contractTotal = dbProjects.filter((project) => project.contract).length;
  const pendingReviews = dbProjects.filter((project) => project.contract?.status === "completed" && !project.contract.reviews.some((review) => review.reviewerId === user.id)).length;
  const latestProposals = dbProjects.flatMap((project) =>
    project.proposals.map((proposal) => ({ ...proposal, projectTitle: project.title }))
  ).slice(0, 5);

  return (
    <main className="container py-10">
      <div className="surface-slab overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6 md:p-8">
            <Badge>Client Console</Badge>
            <h1 className="mt-5 text-4xl font-semibold">客户工作台</h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">管理设计需求、报价、合约、交付和评价。重点先看图文 brief 是否清晰，再筛选设计师报价。</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/projects#publish">发布项目</ButtonLink>
              <ButtonLink href="/projects" variant="secondary">查看项目库</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-56 border-t border-[var(--border)] bg-[var(--accent-3)] lg:border-l lg:border-t-0">
            <Image src="/showcase/color-brand-web.svg" alt="客户图文需求预览" fill className="object-cover" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          [FolderKanban, "进行中项目", String(projects.length)],
          [MessageSquareText, "新报价", String(proposalTotal)],
          [FileCheck2, "合约", String(contractTotal)],
          [Star, "待评价", String(pendingReviews)]
        ] satisfies Array<[LucideIcon, string, string]>).map(([Icon, label, value]) => (
          <Card key={String(label)}>
            <Icon size={20} />
            <p className="mt-4 text-3xl font-medium">{value}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--card)] p-5">
            <h2 className="text-xl font-semibold">项目</h2>
          </div>
          <div className="p-5">
          <div className="divide-y divide-[var(--border)]">
            {projects.length ? projects.map((project) => (
              <div key={project.id} className="grid gap-4 py-4 md:grid-cols-[132px_1fr_auto] md:items-center">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--accent-3)]">
                  <Image src={project.imageUrls?.[0] ?? "/showcase/color-dashboard.svg"} alt={`${project.title} 参考图`} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatMoney(project.budgetMin)}-{formatMoney(project.budgetMax)} · {project.proposals} 个报价
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--border))]">
                    <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(92, 38 + project.proposals * 5)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 md:flex-col md:items-end">
                  <Badge>{formatProjectStatus(project.status)}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                    <CalendarDays size={13} />
                    {project.deadline}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-sm leading-6 text-[var(--muted)]">
                还没有发布项目。先发布一个真实需求，报价和合约会在这里出现。
              </div>
            )}
          </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="text-xl font-semibold">报价队列</h2>
            <div className="mt-4 space-y-3">
              {latestProposals.length ? latestProposals.map((proposal) => (
                <div key={proposal.id} className="rounded-lg border border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--card)] p-4">
                  <p className="font-semibold">{proposal.freelancer.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {proposal.projectTitle} · {formatMoney(proposal.proposedAmount)} · {proposal.estimatedDays} 天
                  </p>
                  <ButtonLink href={`/projects/${proposal.projectId}`} className="mt-3 w-full" variant="secondary">
                    处理报价
                  </ButtonLink>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm leading-6 text-[var(--muted)]">
                  还没有收到报价。
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
