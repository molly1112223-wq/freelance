"use client";

import { Check, Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

const proposalPresets = [
  "我会先梳理信息架构和关键页面，再输出首轮视觉方向供确认。",
  "可在 3 天内提交低保真结构，确认后推进高保真和组件说明。",
  "我做过类似后台和设计系统项目，可以同步整理状态、图表和筛选器规范。"
];

export function ProposalComposer({
  budgetMin,
  budgetMax,
  projectId,
  projectTitle
}: {
  budgetMin: number;
  budgetMax: number;
  projectId: string;
  projectTitle: string;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState(String(Math.round((budgetMin + budgetMax) / 2)));
  const [days, setDays] = useState("21");
  const [message, setMessage] = useState("");

  const scoreItems = useMemo(
    () => [
      { label: "方案说明不少于 60 字", done: plan.trim().length >= 60 },
      { label: "报价在客户预算区间内", done: Number(amount) >= budgetMin && Number(amount) <= budgetMax },
      { label: "交付周期明确", done: Number(days) > 0 },
      { label: "包含协作方式", done: /沟通|确认|同步|评审|交付/.test(plan) }
    ],
    [amount, budgetMax, budgetMin, days, plan]
  );
  const proposalScore = Math.round((scoreItems.filter((item) => item.done).length / scoreItems.length) * 100);

  function submitProposal() {
    if (proposalScore < 75) {
      setMessage("报价还不够完整，请补充方案、预算或交付周期。");
      return;
    }
    submitProposalRequest();
  }

  async function submitProposalRequest() {
    const response = await fetch(`/api/projects/${projectId}/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coverLetter: plan.trim(),
        proposedAmount: Number(amount),
        estimatedDays: Number(days)
      })
    });

    if (response.ok) {
      setMessage("报价已提交到数据库，客户可以在真实报价队列里查看。");
      router.refresh();
      return;
    }

    const result = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    setMessage(result?.error?.message ?? `提交失败。请确认你已用自由职业者账号登录，并且项目「${projectTitle}」仍在招募中。`);
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">提交报价</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">写清楚方法、节奏和交付物，客户更容易判断匹配度。</p>
        </div>
        <div className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_22%,var(--border))] bg-[var(--accent-3)] px-3 py-2 text-sm font-semibold">
          {proposalScore}%
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {proposalPresets.map((preset) => (
          <button
            key={preset}
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-left text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            type="button"
            onClick={() => setPlan((current) => [current, preset].filter(Boolean).join("\n"))}
          >
            {preset.slice(0, 14)}...
          </button>
        ))}
      </div>
      <form className="mt-4 space-y-3">
        <Textarea
          value={plan}
          onChange={(event) => setPlan(event.target.value)}
          placeholder="说明你的方案、经验、协作方式和交付计划"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="报价金额（人民币）" type="number" />
          <Input value={days} onChange={(event) => setDays(event.target.value)} placeholder="预计交付天数" type="number" />
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_74%,var(--background))] p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Sparkles size={16} />
            报价检查
          </div>
          <div className="grid gap-2 text-xs text-[var(--muted)]">
            {scoreItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className={`grid size-4 place-items-center rounded-full border ${
                    item.done ? "border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)]" : "border-[var(--border)]"
                  }`}
                >
                  {item.done ? <Check size={10} /> : null}
                </span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full" type="button" onClick={submitProposal}>
          <Send size={16} />
          提交报价
        </Button>
        {message ? <p className="text-sm leading-6 text-[var(--muted)]">{message}</p> : null}
      </form>
    </Card>
  );
}
