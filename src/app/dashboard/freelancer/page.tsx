import Image from "next/image";
import { redirect } from "next/navigation";
import { Briefcase, CircleDollarSign, FileUp, Star, UploadCloud, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FreelancerProfileEditor } from "@/components/freelancer-profile-editor";
import { getCurrentUser } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { toProject } from "@/lib/project-mappers";

export default async function FreelancerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "client") redirect("/dashboard/client");

  const [proposals, dbProjects] = await Promise.all([
    prisma.proposal.findMany({
      where: { freelancerId: user.id },
      include: { project: { include: { contract: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.project.findMany({
      where: { status: "published" },
      include: { client: { select: { name: true } }, _count: { select: { proposals: true } } },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);
  const projects = dbProjects.map(toProject);
  const proposalAmount = proposals.reduce((total, proposal) => total + proposal.proposedAmount, 0);
  const profile = user.freelancerProfile;
  const profileSkills = (Array.isArray(profile?.skills) ? profile.skills : []) as string[];
  const portfolioUrls = (Array.isArray(profile?.portfolioUrls) ? profile.portfolioUrls : []) as string[];
  const deliverableTotal = proposals.filter((proposal) => proposal.project.contract?.freelancerId === user.id).length;

  return (
    <main className="container py-10">
      <div className="surface-slab overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6 md:p-8">
            <Badge>Designer Console</Badge>
            <h1 className="mt-5 text-4xl font-semibold">设计师工作台</h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">跟进个人资料、投递、合约、交付和评价。作品集和报价质量会直接影响客户筛选。</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/projects">寻找项目</ButtonLink>
              <ButtonLink href="/freelancers" variant="secondary">
                <UploadCloud size={16} />
                查看人才库
              </ButtonLink>
            </div>
          </div>
          <div className="relative min-h-56 border-t border-[var(--border)] bg-[var(--accent-3)] lg:border-l lg:border-t-0">
            <Image src="/showcase/color-mobile-flow.svg" alt="设计师作品集预览" fill className="object-cover" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          [Briefcase, "已投递", String(proposals.length)],
          [CircleDollarSign, "意向金额", proposalAmount ? formatMoney(proposalAmount) : formatMoney(0)],
          [FileUp, "交付物", String(deliverableTotal)],
          [Star, "评分", profile?.ratingAvg ? String(profile.ratingAvg) : "暂无"]
        ] satisfies Array<[LucideIcon, string, string]>).map(([Icon, label, value]) => (
          <Card key={String(label)}>
            <Icon size={20} />
            <p className="mt-4 text-3xl font-medium">{value}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <div className="relative h-32 border-b border-[var(--border)] bg-[var(--accent-3)]">
              <Image src="/showcase/color-system.svg" alt="个人作品封面" fill className="object-cover" />
            </div>
            <div className="p-5">
            <h2 className="text-xl font-semibold">个人资料</h2>
            <div className="mt-4 grid size-16 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] text-2xl font-medium text-[var(--accent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_18%,var(--border))]">
              {user.name.slice(0, 1)}
            </div>
            <p className="mt-4 font-semibold">{profile?.title ?? "自由职业设计师"}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {profile?.bio ?? "可承接数据看板、新手引导和设计系统项目。"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profileSkills.slice(0, 5).concat(profileSkills.length ? [] : ["Figma", "用户体验", "设计系统"]).map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_74%,var(--background))] p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">资料完整度</span>
                <span className="font-semibold">86%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--border))]">
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: "86%" }} />
              </div>
            </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">编辑作品集资料</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">选择技能标签、填写作品链接后，客户在作品集页可以更快筛到你。</p>
            <div className="mt-5">
              <FreelancerProfileEditor
                initialProfile={{
                  title: profile?.title ?? "自由职业设计师",
                  bio: profile?.bio ?? "我擅长将业务目标转化为清晰的产品界面和品牌视觉。",
                  skills: profileSkills,
                  hourlyRate: profile?.hourlyRate ?? 0,
                  portfolioUrls
                }}
              />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">我的投递</h2>
              <Badge>{proposals.length} 条</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {proposals.length ? proposals.slice(0, 5).map((proposal) => (
                <div key={proposal.id} className="rounded-lg border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{proposal.project.title}</p>
                    <Badge>{proposal.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatMoney(proposal.proposedAmount)} · {proposal.estimatedDays} 天
                  </p>
                  <ButtonLink href={`/projects/${proposal.projectId}`} className="mt-3 w-full" variant="secondary">
                    查看进度
                  </ButtonLink>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed border-[var(--border)] p-5 text-sm leading-6 text-[var(--muted)]">
                  还没有投递记录。进入项目详情提交报价后，这里会出现跟进状态。
                </div>
              )}
            </div>
          </Card>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--card)] p-5">
            <h2 className="text-xl font-semibold">推荐项目</h2>
          </div>
          <div className="p-5">
          <div className="divide-y divide-[var(--border)]">
            {projects.length ? projects.map((project) => (
              <div key={project.id} className="grid gap-4 py-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--accent-3)]">
                  <Image src={project.imageUrls?.[0] ?? "/showcase/color-dashboard.svg"} alt={`${project.title} 参考图`} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {project.category} · {formatMoney(project.budgetMin)}-{formatMoney(project.budgetMax)}
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">匹配技能：{project.skillsRequired.slice(0, 2).join("、")}</p>
                </div>
                <ButtonLink href={`/projects/${project.id}`} variant="secondary">
                  投递
                </ButtonLink>
              </div>
            )) : (
              <div className="py-10 text-sm leading-6 text-[var(--muted)]">
                当前没有招募中的项目。
              </div>
            )}
          </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
