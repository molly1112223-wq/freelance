import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default async function FreelancerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.freelancerProfile.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          reviewsReceived: { orderBy: { createdAt: "desc" }, take: 3 }
        }
      }
    }
  });

  if (!profile) {
    notFound();
  }

  const skills = stringArray(profile.skills);
  const portfolioUrls = stringArray(profile.portfolioUrls);
  const latestReview = profile.user.reviewsReceived[0];

  return (
    <main className="container grid gap-6 py-10 lg:grid-cols-[1fr_340px]">
      <section className="surface-slab p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] text-3xl font-medium text-[var(--accent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_18%,var(--border))]">
            {profile.user.name.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-4xl font-semibold">{profile.user.name}</h1>
            <p className="mt-2 text-[var(--muted)]">{profile.title}</p>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-[var(--muted)]">{profile.bio}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="text-xl font-semibold">作品集</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {portfolioUrls.length ? portfolioUrls.map((item) => (
              <a key={item} className="rounded-lg border border-[var(--border)] p-4 text-sm font-medium hover:border-[var(--muted)]" href={item} rel="noreferrer" target="_blank">
                {item}
              </a>
            )) : (
              <div className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)] md:col-span-3">
                这位自由职业者暂未添加作品集链接。
              </div>
            )}
          </div>
        </Card>
        <Card className="mt-4">
          <h2 className="text-xl font-semibold">客户评价</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {latestReview?.comment ?? "暂无公开评价。完成项目后，客户评价会显示在这里。"}
          </p>
        </Card>
      </section>
      <aside>
        <Card>
          <p className="text-sm text-[var(--muted)]">时薪</p>
          <p className="mt-1 text-xl font-semibold">{formatMoney(profile.hourlyRate ?? 0)}/小时</p>
          <p className="mt-5 text-sm text-[var(--muted)]">评分</p>
          <p className="mt-1 flex items-center gap-1 font-semibold">
            <Star size={16} fill="currentColor" />
            {profile.ratingAvg || "暂无"}
          </p>
          <p className="mt-5 text-sm text-[var(--muted)]">已完成项目</p>
          <p className="mt-1 font-semibold">{profile.completedProjects}</p>
          <ButtonLink href="/projects" className="mt-6 w-full">
            邀请合作
          </ButtonLink>
        </Card>
      </aside>
    </main>
  );
}
