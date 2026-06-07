"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const skillOptions = ["Figma", "UI 设计", "UX 研究", "品牌视觉", "产品设计", "设计系统", "数据可视化", "运营视觉", "插画", "Webflow", "前端基础"];

type ProfileEditorProps = {
  initialProfile: {
    title: string;
    bio: string;
    skills: string[];
    hourlyRate: number;
    portfolioUrls: string[];
  };
};

export function FreelancerProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [title, setTitle] = useState(initialProfile.title);
  const [bio, setBio] = useState(initialProfile.bio);
  const [skills, setSkills] = useState(initialProfile.skills.length ? initialProfile.skills : ["Figma", "UI 设计"]);
  const [hourlyRate, setHourlyRate] = useState(String(initialProfile.hourlyRate || ""));
  const [portfolioUrls, setPortfolioUrls] = useState(initialProfile.portfolioUrls);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function toggleSkill(skill: string) {
    setSkills((current) => (current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]));
  }

  function addPortfolioUrl() {
    const value = portfolioInput.trim();
    if (!value || portfolioUrls.includes(value)) return;
    setPortfolioUrls((current) => [...current, value].slice(0, 6));
    setPortfolioInput("");
  }

  async function saveProfile() {
    setIsSaving(true);
    setMessage("");
    const response = await fetch("/api/freelancers/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        bio,
        skills,
        hourlyRate: Number(hourlyRate) || 0,
        portfolioUrls
      })
    });
    const result = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    setIsSaving(false);
    setMessage(response.ok ? "资料已保存，作品集页会同步更新。" : result?.error?.message ?? "保存失败，请检查填写内容。");
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium">职业标题</p>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：品牌与 UI 设计师" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">简介</p>
        <Textarea className="min-h-28" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="写清楚你擅长的行业、项目类型和交付方式" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">技能标签</p>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                skills.includes(skill)
                  ? "border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              type="button"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">时薪</p>
        <Input value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} placeholder="例如：500" type="number" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">作品集链接</p>
        <div className="flex gap-2">
          <Input value={portfolioInput} onChange={(event) => setPortfolioInput(event.target.value)} placeholder="https://..." type="url" />
          <button className="grid size-11 shrink-0 place-items-center rounded border border-[var(--border)] hover:bg-[var(--accent-3)]" type="button" onClick={addPortfolioUrl} aria-label="添加作品集链接">
            <Plus size={17} />
          </button>
        </div>
        {portfolioUrls.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {portfolioUrls.map((url) => (
              <button key={url} className="inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs" type="button" onClick={() => setPortfolioUrls((current) => current.filter((item) => item !== url))}>
                <span className="truncate">{url}</span>
                <X size={13} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button disabled={isSaving} type="button" onClick={saveProfile}>
          {isSaving ? "保存中..." : "保存作品集资料"}
        </Button>
        {message ? (
          <p className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            {message.startsWith("资料") ? <Check size={15} /> : null}
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
