"use client";

import { Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";

type Freelancer = {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  ratingAvg: number;
};

const fallbackSkills = ["Figma", "UI 设计", "品牌视觉", "产品设计", "设计系统", "运营视觉", "数据可视化"];

export function FreelancerDirectory({ freelancers }: { freelancers: Freelancer[] }) {
  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const skills = useMemo(() => {
    const fromProfiles = Array.from(new Set(freelancers.flatMap((freelancer) => freelancer.skills)));
    return fromProfiles.length ? fromProfiles : fallbackSkills;
  }, [freelancers]);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const haystack = [freelancer.name, freelancer.title, freelancer.bio, ...freelancer.skills].join(" ").toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.every((skill) => freelancer.skills.includes(skill));
    return matchesQuery && matchesSkills;
  });

  function toggleSkill(skill: string) {
    setSelectedSkills((current) => (current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]));
  }

  return (
    <>
      <div className="surface-slab p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-semibold">作品集</h1>
            <p className="mt-3 text-[var(--muted)]">浏览自由职业者案例与技能标签，点选标签即可筛选匹配人才。</p>
          </div>
          <div className="flex gap-2">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索设计师、技能或服务" className="w-full md:w-72" />
            <button className="grid size-11 place-items-center rounded-lg bg-[var(--button-bg)] text-[var(--button-text)] transition-colors hover:bg-[var(--button-bg-hover)]" aria-label="搜索设计师" type="button">
              <Search size={18} />
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedSkills.includes(skill)
                  ? "border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              onClick={() => toggleSkill(skill)}
              type="button"
            >
              {skill}
            </button>
          ))}
        </div>
        {selectedSkills.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[var(--muted)]">已添加技能：</span>
            {selectedSkills.map((skill) => (
              <button key={skill} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1" onClick={() => toggleSkill(skill)} type="button">
                {skill}
                <X size={14} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {filteredFreelancers.length ? filteredFreelancers.map((freelancer, index) => (
          <Card key={freelancer.id} className="animate-fade-up overflow-hidden p-0" style={{ animationDelay: `${index * 60}ms` }}>
            <div
              className="h-28 border-b border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-cover bg-center"
              style={{ backgroundImage: `url("/showcase/${index % 3 === 0 ? "color-dashboard" : index % 3 === 1 ? "color-brand-web" : "color-mobile-flow"}.svg")` }}
            />
            <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full border border-[var(--border)] bg-[var(--card)] font-medium shadow-[0_8px_24px_oklch(0.2_0.05_248_/_0.08)]">
                {freelancer.name.slice(0, 1)}
              </div>
              <div>
                <h2 className="font-semibold">{freelancer.name}</h2>
                <p className="text-sm text-[var(--muted)]">{freelancer.title}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{freelancer.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {freelancer.skills.map((skill) => (
                <button key={skill} onClick={() => toggleSkill(skill)} type="button">
                  <Badge>{skill}</Badge>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 font-semibold">
                <Star size={16} fill="currentColor" />
                {freelancer.ratingAvg}
              </span>
              <span>{formatMoney(freelancer.hourlyRate)}/小时</span>
            </div>
            <ButtonLink href={`/freelancers/${freelancer.id}`} className="mt-5 w-full" variant="secondary">
              查看资料
            </ButtonLink>
            </div>
          </Card>
        )) : (
          <Card className="py-12 text-center lg:col-span-3">
            <div className="mx-auto grid size-14 place-items-center rounded-lg bg-[var(--accent-3)] text-[var(--accent)]">
              <Search size={22} />
            </div>
            <h2 className="mt-5 text-xl font-semibold">没有找到匹配作品集</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              可以减少技能标签，或邀请自由职业者先到工作台完善作品集资料。
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
