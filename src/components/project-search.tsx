"use client";

import { Bot, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate, formatMoney, formatProjectStatus } from "@/lib/format";

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  skillsRequired: string[];
  expectedDeliverables?: string[];
  imageUrls?: string[];
  deadline: string;
  status: string;
  client: { name: string };
  proposals: number;
};

export function ProjectSearch({ initialQuery = "", projects }: { initialQuery?: string; projects: Project[] }) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("全部");
  const categories = useMemo(() => ["全部", ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === "全部" || project.category === activeCategory;
    const haystack = [project.title, project.description, project.category, ...project.skillsRequired].join(" ").toLowerCase();
    return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
  });

  return (
    <>
      <div className="surface-slab p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--accent)]">
              <Sparkles size={15} />
              Opportunity Feed
            </div>
            <h1 className="text-4xl font-semibold">需求广场</h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">当前开放 {projects.length} 个需求。先像浏览灵感一样查看机会，再用 AI 辅助把自己的想法整理成可执行 brief。</p>
          </div>
          <form className="flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目、技能或行业" className="w-full md:w-72" />
            <button className="grid size-11 place-items-center rounded-lg bg-[var(--button-bg)] text-[var(--button-text)] transition-colors hover:bg-[var(--button-bg-hover)]" aria-label="搜索项目" type="button">
              <Search size={18} />
            </button>
          </form>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  activeCategory === category
                    ? "border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <SlidersHorizontal size={16} />
            已匹配 {filteredProjects.length} 个设计需求
          </div>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_22%,var(--border))] bg-[color-mix(in_srgb,var(--accent-4)_52%,var(--card))] p-4 text-sm leading-6 text-[var(--ink-2)]">
            <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)]">
              <Bot size={16} />
              AI 辅助匹配即将接入
            </span>
            <span className="ml-2">后续可根据预算、技能、交付物自动推荐适合人才，并帮自由职业者生成投递建议。</span>
          </div>
          <a className="inline-flex h-11 items-center justify-center rounded border border-[var(--border)] px-4 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--muted)] hover:bg-[var(--accent-3)]" href="#publish">
            发布新的设计需求
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {filteredProjects.length ? filteredProjects.map((project, index) => (
          <Card key={project.id} className="animate-fade-up overflow-hidden p-0" style={{ animationDelay: `${index * 55}ms` }}>
            <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge>{project.category}</Badge>
                  <Badge>{formatProjectStatus(project.status)}</Badge>
                  {project.imageUrls?.length ? <Badge>图文需求</Badge> : null}
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{String(index + 1).padStart(2, "0")} · {project.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">{project.description}</p>
                {project.imageUrls?.length ? (
                  <div className="mt-5 grid max-w-2xl grid-cols-3 gap-2">
                    {project.imageUrls.slice(0, 3).map((imageUrl, imageIndex) => (
                      <div
                        key={`${project.id}-${imageUrl}-${imageIndex}`}
                        className="aspect-[4/3] rounded-lg border border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--accent-3)] bg-cover bg-center transition duration-300 hover:scale-[1.015]"
                        style={{ backgroundImage: `url("${imageUrl}")` }}
                        aria-label={`${project.title} 参考图 ${imageIndex + 1}`}
                      />
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.skillsRequired.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
                {project.expectedDeliverables?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.expectedDeliverables.slice(0, 4).map((item) => (
                      <span key={item} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="border-t border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--card)] p-5 lg:border-l lg:border-t-0">
                <p className="text-sm text-[var(--muted)]">预算</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatMoney(project.budgetMin)}-{formatMoney(project.budgetMax)}
                </p>
                <p className="mt-4 text-sm text-[var(--muted)]">截止日期</p>
                <p className="mt-1 font-semibold">{formatDate(project.deadline)}</p>
                <ButtonLink href={`/projects/${project.id}`} className="mt-5 w-full">
                  查看项目
                </ButtonLink>
              </div>
            </div>
          </Card>
        )) : (
          <Card className="py-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-lg bg-[var(--accent-3)] text-[var(--accent)]">
              <Search size={22} />
            </div>
            <h2 className="mt-5 text-xl font-semibold">没有找到匹配项目</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              换一个关键词，或切回「全部」分类查看当前开放的设计需求。
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
