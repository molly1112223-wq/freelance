"use client";

import { Check, ImagePlus, PenLine, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import type { Project } from "@/components/project-search";

const suggestedSkills = ["产品设计", "UI 设计", "品牌视觉", "设计系统", "Figma", "数据可视化", "运营视觉", "用户研究"];

const briefTemplates = [
  {
    label: "官网改版",
    title: "新消费品牌官网视觉升级",
    category: "品牌设计",
    description:
      "我们需要重新设计品牌官网首页和核心转化页，希望设计师参考现有品牌资产，补充更清晰的首屏视觉、服务介绍模块和移动端适配方案。需要交付桌面端、移动端和关键组件说明。",
    skills: ["品牌视觉", "UI 设计", "Figma"],
    budgetMin: "30000",
    budgetMax: "65000"
  },
  {
    label: "后台 UI",
    title: "会员增长后台 UI 设计",
    category: "UI/UX 设计",
    description:
      "我们需要为会员增长后台设计一套清晰、克制的数据界面，覆盖收入、留存、渠道转化和团队周报。希望设计师能处理信息层级、筛选器、图表状态和组件规范。",
    skills: ["UI 设计", "数据可视化", "Figma", "设计系统"],
    budgetMin: "45000",
    budgetMax: "90000"
  },
  {
    label: "运营视觉",
    title: "618 活动主视觉与落地页设计",
    category: "运营视觉",
    description:
      "我们需要设计一套电商活动视觉，包括主 KV、落地页首屏、商品模块和移动端投放物料。希望画面高级克制，能突出优惠信息和品牌识别，同时提供可复用版式。",
    skills: ["运营视觉", "品牌视觉", "Figma"],
    budgetMin: "18000",
    budgetMax: "42000"
  }
];

const deliverables = ["信息架构", "高保真界面", "移动端适配", "组件说明", "交付标注"];

const referenceImages = [
  { name: "彩色后台参考图", url: "/showcase/color-dashboard.svg" },
  { name: "移动流程参考图", url: "/showcase/color-mobile-flow.svg" },
  { name: "品牌官网参考图", url: "/showcase/color-brand-web.svg" }
];

type ComposerImage = {
  id: string;
  url: string;
  name: string;
};

export function ProjectBriefComposer({ onPublish }: { onPublish: (project: Project) => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("新消费品牌官网视觉升级");
  const [description, setDescription] = useState(
    "我们需要重新设计品牌官网首页和核心转化页，希望设计师参考现有品牌资产，补充更清晰的首屏视觉、服务介绍模块和移动端适配方案。"
  );
  const [category, setCategory] = useState("品牌设计");
  const [budgetMin, setBudgetMin] = useState("30000");
  const [budgetMax, setBudgetMax] = useState("65000");
  const [deadline, setDeadline] = useState("2026-07-20");
  const [skills, setSkills] = useState(["品牌视觉", "UI 设计", "Figma"]);
  const [images, setImages] = useState<ComposerImage[]>([]);
  const [publishedMessage, setPublishedMessage] = useState("");
  const [publishedProjectId, setPublishedProjectId] = useState("");
  const [selectedDeliverables, setSelectedDeliverables] = useState(["高保真界面", "移动端适配", "组件说明"]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scoreItems = [
    { label: "标题明确", done: title.trim().length >= 5 },
    { label: "说明不少于 80 字", done: description.trim().length >= 80 },
    { label: "预算区间完整", done: Number(budgetMin) > 0 && Number(budgetMax) >= Number(budgetMin) },
    { label: "技能不少于 3 个", done: skills.length >= 3 },
    { label: "交付物已选择", done: selectedDeliverables.length >= 2 },
    { label: "参考图已上传", done: images.length > 0 }
  ];
  const briefScore = Math.round((scoreItems.filter((item) => item.done).length / scoreItems.length) * 100);
  const missingItems = scoreItems.filter((item) => !item.done).map((item) => item.label);

  function toggleSkill(skill: string) {
    setSkills((current) => (current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]));
  }

  function toggleDeliverable(item: string) {
    setSelectedDeliverables((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
  }

  function applyTemplate(template: (typeof briefTemplates)[number]) {
    setTitle(template.title);
    setCategory(template.category);
    setDescription(template.description);
    setSkills(template.skills);
    setBudgetMin(template.budgetMin);
    setBudgetMax(template.budgetMax);
    setPublishedMessage("");
    setPublishedProjectId("");
  }

  async function handleImages(files: FileList | null) {
    if (!files?.length) return;

    const selectedFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 6 - images.length);

    const nextImages = await Promise.all(
      selectedFiles.map(async (file, index) => {
        const url = await readImageAsDataUrl(file);
        return {
          id: `${file.name}-${Date.now()}-${index}`,
          url,
          name: file.name
        };
      })
    );

    setImages((current) => [...current, ...nextImages].slice(0, 6));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function useDemoImages() {
    setImages(
      referenceImages.map((image, index) => ({
        id: `reference-${index}`,
        url: image.url,
        name: image.name
      }))
    );
  }

  function removeImage(id: string) {
    setImages((current) => current.filter((image) => image.id !== id));
  }

  async function publishProject() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || trimmedDescription.length < 20 || skills.length === 0) {
      setPublishedMessage("请补充标题、至少 20 字说明和 1 个技能标签。");
      setPublishedProjectId("");
      return;
    }

    const draftProject: Project = {
      id: `local-project-${Date.now()}`,
      title: trimmedTitle,
      description: trimmedDescription,
      category,
      budgetMin: Number(budgetMin) || 1,
      budgetMax: Number(budgetMax) || Number(budgetMin) || 1,
      skillsRequired: skills,
      imageUrls: images.map((image) => image.url),
      deadline,
      status: "published",
      client: { name: "当前登录客户" },
      proposals: 0
    };

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draftProject.title,
        description: draftProject.description,
        category: draftProject.category,
        budgetMin: draftProject.budgetMin,
        budgetMax: draftProject.budgetMax,
        skillsRequired: draftProject.skillsRequired,
        imageUrls: draftProject.imageUrls,
        deadline: draftProject.deadline
      })
    });

    if (response.ok) {
      const result = (await response.json()) as { data: { id: string } };
      onPublish({ ...draftProject, id: result.data.id, client: { name: "当前登录客户" } });
      setPublishedMessage("已发布到数据库，设计师现在可以看到这份真实图文需求。");
      setPublishedProjectId(result.data.id);
      router.refresh();
      return;
    }

    const result = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    setPublishedMessage(result?.error?.message ?? "发布失败。请确认你已用客户账号登录，并已配置数据库。");
    setPublishedProjectId("");
  }

  return (
    <Card id="publish" className="overflow-hidden p-0">
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="absolute inset-x-8 top-8 h-px bg-[color-mix(in_srgb,var(--ink)_16%,transparent)] animate-slow-scan" />
          <Badge>客户发布</Badge>
          <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-4xl">发布图文设计需求</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
            把文字说明、参考图、预算和技能要求放在同一份 brief 里，设计师更容易判断风格和工作量。
          </p>
          <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--accent-3)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <PenLine size={16} />
              Brief 质量提示
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              好的图文需求通常包含：业务背景、目标页面、参考风格、必须保留的内容、预算区间和交付时间。
            </p>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-xs text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-2 text-center">说明</span>
            <span className="h-px w-4 bg-[var(--border)]" />
            <span className="rounded-full border border-[var(--border)] px-3 py-2 text-center">参考图</span>
            <span className="h-px w-4 bg-[var(--border)]" />
            <span className="rounded-full border border-[var(--border)] px-3 py-2 text-center">报价</span>
          </div>
          <div className="mt-5 rounded-lg border border-[color-mix(in_srgb,var(--ink)_10%,var(--border))] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles size={16} />
                Superpowers
              </div>
              <span className="text-xl font-semibold">{briefScore}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--border))]">
              <div className="h-full rounded-full bg-[var(--button-bg)] transition-[width] duration-300" style={{ width: `${briefScore}%` }} />
            </div>
            <div className="mt-4 grid gap-2 text-xs text-[var(--muted)]">
              {scoreItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`grid size-4 place-items-center rounded-full border ${item.done ? "border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)]" : "border-[var(--border)]"}`}>
                    {item.done ? <Check size={10} /> : null}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
            {missingItems.length ? (
              <p className="mt-4 text-xs leading-5 text-[var(--muted)]">建议补充：{missingItems.slice(0, 3).join("、")}</p>
            ) : (
              <p className="mt-4 text-xs leading-5 text-[var(--muted)]">这份 brief 已经足够设计师快速判断工作量。</p>
            )}
          </div>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <div>
            <p className="mb-3 text-sm font-medium">一键模板</p>
            <div className="flex flex-wrap gap-2">
              {briefTemplates.map((template) => (
                <button
                  key={template.label}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  type="button"
                  onClick={() => applyTemplate(template)}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="项目标题" />
            <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="设计分类" />
          </div>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="写清楚业务背景、设计范围、参考方向和交付要求"
            className="min-h-40"
          />
          <div className="grid gap-3 md:grid-cols-3">
            <Input value={budgetMin} onChange={(event) => setBudgetMin(event.target.value)} placeholder="最低预算" type="number" />
            <Input value={budgetMax} onChange={(event) => setBudgetMax(event.target.value)} placeholder="最高预算" type="number" />
            <Input value={deadline} onChange={(event) => setDeadline(event.target.value)} type="date" />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">技能标签</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
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
            <p className="mb-3 text-sm font-medium">预期交付物</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {deliverables.map((item) => (
                <button
                  key={item}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                    selectedDeliverables.includes(item)
                      ? "border-[var(--button-bg)] bg-[var(--accent-3)] text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                  type="button"
                  onClick={() => toggleDeliverable(item)}
                >
                  {item}
                  {selectedDeliverables.includes(item) ? <Check size={15} /> : null}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">参考图</p>
              <div className="flex items-center gap-3">
                <button className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]" type="button" onClick={useDemoImages}>
                  插入参考图
                </button>
                <button className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]" type="button" onClick={() => fileInputRef.current?.click()}>
                  添加图片
                </button>
              </div>
            </div>
            <input ref={fileInputRef} className="hidden" type="file" accept="image/*" multiple onChange={(event) => handleImages(event.target.files)} />
            {images.length ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image) => (
                  <div key={image.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--border)] bg-cover bg-center" style={{ backgroundImage: `url("${image.url}")` }}>
                    <button
                      className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-[var(--button-bg)] text-[var(--button-text)] opacity-0 transition-opacity group-hover:opacity-100"
                      type="button"
                      onClick={() => removeImage(image.id)}
                      aria-label={`删除 ${image.name}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <button
                className="flex min-h-36 w-full flex-col items-center justify-center rounded-lg border border-dashed border-[color-mix(in_srgb,var(--ink)_24%,var(--border))] bg-[var(--accent-3)] text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={22} />
                <span className="mt-3">上传参考图、草图或竞品截图</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="button" onClick={publishProject}>
              发布图文需求
            </Button>
            {publishedProjectId ? (
              <ButtonLink href={`/projects/${publishedProjectId}`} variant="secondary">
                查看项目详情
              </ButtonLink>
            ) : null}
            {publishedMessage ? <p className="text-sm text-[var(--muted)]">{publishedMessage}</p> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
