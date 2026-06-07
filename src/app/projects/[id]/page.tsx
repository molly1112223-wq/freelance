import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProposalComposer } from "@/components/proposal-composer";
import { ProjectWorkflowPanel } from "@/components/project-workflow-panel";
import { formatDate, formatMoney, formatProjectStatus } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toProject } from "@/lib/project-mappers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, dbProject] = await Promise.all([
    getCurrentUser(),
    prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        selectedFreelancer: { select: { id: true, name: true } },
        proposals: {
          include: { freelancer: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }
        },
        contract: {
          include: {
            deliverables: { orderBy: { createdAt: "desc" } },
            reviews: true,
            freelancer: { select: { id: true, name: true } },
            client: { select: { id: true, name: true } }
          }
        },
        _count: { select: { proposals: true } }
      }
    })
  ]);

  if (!dbProject) notFound();

  const project = toProject(dbProject);
  const canSubmitProposal = user?.role === "freelancer" && project.status === "published";

  return (
    <main className="container grid gap-6 py-10 lg:grid-cols-[1fr_360px]">
      <section className="surface-slab p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge>{project.category}</Badge>
          <Badge>{formatProjectStatus(project.status)}</Badge>
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight">{project.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)]">{project.description}</p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            ["设计范围", project.category],
            ["交付节奏", `${formatDate(project.deadline)} 前`],
            ["协作重点", project.imageUrls?.length ? "图文参考清晰" : "需补充参考图"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_74%,var(--background))] p-4">
              <p className="text-xs text-[var(--muted)]">{label}</p>
              <p className="mt-2 font-semibold">{value}</p>
            </div>
          ))}
        </div>
        {project.imageUrls?.length ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">客户参考图</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {project.imageUrls.map((imageUrl, index) => (
                <div
                  key={`${project.id}-${imageUrl}-${index}`}
                  className="aspect-[16/10] rounded-lg border border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--accent-3)] bg-cover bg-center transition duration-300 hover:scale-[1.01]"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                  aria-label={`${project.title} 客户参考图 ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.skillsRequired.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="text-xl font-semibold">客户信息</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">{project.client.name}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            已认证客户，预算和需求清晰，支持合约、交付物验收和项目评价流程。
          </p>
        </Card>
      </section>
      <aside className="space-y-4">
        <Card>
          <p className="text-sm text-[var(--muted)]">预算</p>
          <p className="mt-1 text-xl font-semibold">
            {formatMoney(project.budgetMin)}-{formatMoney(project.budgetMax)}
          </p>
          <p className="mt-5 text-sm text-[var(--muted)]">截止日期</p>
          <p className="mt-1 font-semibold">{formatDate(project.deadline)}</p>
          <p className="mt-5 text-sm text-[var(--muted)]">已收到报价</p>
          <p className="mt-1 font-semibold">{project.proposals}</p>
        </Card>
        <ProjectWorkflowPanel project={dbProject} currentUserId={user?.id ?? null} />
        {canSubmitProposal ? (
          <ProposalComposer
            budgetMin={project.budgetMin}
            budgetMax={project.budgetMax}
            projectId={project.id}
            projectTitle={project.title}
          />
        ) : (
          <Card>
            <h2 className="text-xl font-semibold">提交报价</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {user
                ? "只有自由职业者账号可以在招募中的项目提交报价。"
                : "登录自由职业者账号后可以提交报价。"}
            </p>
          </Card>
        )}
      </aside>
    </main>
  );
}
