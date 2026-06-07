"use client";

import { CheckCircle2, Clock, FileCheck2, Send, ShieldCheck, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";

type ProposalItem = {
  id: string;
  coverLetter: string;
  proposedAmount: number;
  estimatedDays: number;
  status: string;
  freelancerId: string;
  createdAt: Date | string;
  freelancer: { id: string; name: string } | null;
};

type DeliverableItem = {
  id: string;
  message: string;
  fileUrls: unknown;
  status: string;
  createdAt: Date | string;
};

type ReviewItem = {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
};

type ContractItem = {
  id: string;
  amount: number;
  status: string;
  clientId: string;
  freelancerId: string;
  deliverables: DeliverableItem[];
  reviews: ReviewItem[];
  freelancer: { id: string; name: string } | null;
  client: { id: string; name: string } | null;
} | null;

type ProjectWithWorkflow = {
  id: string;
  title: string;
  status: string;
  clientId: string;
  proposals: ProposalItem[];
  contract: ContractItem;
};

export function ProjectWorkflowPanel({
  project,
  currentUserId
}: {
  project: ProjectWithWorkflow;
  currentUserId: string | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [deliverableMessage, setDeliverableMessage] = useState("");
  const [fileUrls, setFileUrls] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [rating, setRating] = useState("5");
  const [isBusy, setIsBusy] = useState(false);

  const isClientOwner = currentUserId === project.clientId;
  const isSelectedFreelancer = Boolean(project.contract && currentUserId === project.contract.freelancerId);
  const approvedDeliverable = project.contract?.deliverables.find((deliverable) => deliverable.status === "approved");
  const submittedDeliverable = project.contract?.deliverables.find((deliverable) => deliverable.status === "submitted");
  const revieweeId = useMemo(() => {
    if (!project.contract || !currentUserId) return "";
    return currentUserId === project.contract.clientId ? project.contract.freelancerId : project.contract.clientId;
  }, [currentUserId, project.contract]);
  const hasReviewed = Boolean(project.contract?.reviews.some((review) => review.reviewerId === currentUserId));

  const steps = [
    { label: "项目发布", done: true },
    { label: "收到报价", done: project.proposals.length > 0 },
    { label: "确认合约", done: Boolean(project.contract) },
    { label: "提交交付物", done: Boolean(project.contract?.deliverables.length) },
    { label: "验收完成", done: project.status === "completed" }
  ];

  async function requestJson(url: string, init: RequestInit, successMessage: string) {
    setIsBusy(true);
    setMessage("");
    const response = await fetch(url, init);
    const result = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    setIsBusy(false);

    if (!response.ok) {
      setMessage(result?.error?.message ?? "操作失败，请稍后重试。");
      return;
    }

    setMessage(successMessage);
    router.refresh();
  }

  function acceptProposal(id: string) {
    void requestJson(
      `/api/proposals/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" })
      },
      "已接受报价并创建合约。"
    );
  }

  function rejectProposal(id: string) {
    void requestJson(
      `/api/proposals/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      },
      "已拒绝该报价。"
    );
  }

  function submitDeliverable() {
    if (!project.contract) return;
    void requestJson(
      `/api/contracts/${project.contract.id}/deliverables`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: deliverableMessage,
          fileUrls: fileUrls
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        })
      },
      "交付物已提交，等待客户验收。"
    );
  }

  function approveDeliverable(id: string) {
    void requestJson(
      `/api/deliverables/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      },
      "交付物已验收，项目已完成。"
    );
  }

  function submitReview() {
    if (!project.contract || !revieweeId) return;
    void requestJson(
      "/api/reviews",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: project.contract.id,
          revieweeId,
          rating: Number(rating),
          comment: reviewComment
        })
      },
      "评价已提交。"
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">交易进度</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">报价、合约、交付和验收都在这里完成。</p>
        </div>
        <Badge>{project.proposals.length} 个报价</Badge>
      </div>

      <div className="mt-5 grid gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_74%,var(--background))] p-3">
            <span className={`grid size-8 place-items-center rounded-full ${step.done ? "bg-[var(--button-bg)] text-[var(--button-text)]" : "bg-[var(--accent-3)] text-[var(--muted)]"}`}>
              {step.done ? <CheckCircle2 size={16} /> : String(index + 1)}
            </span>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>

      {isClientOwner && project.status === "published" ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">报价队列</h3>
          <div className="mt-3 space-y-3">
            {project.proposals.length ? project.proposals.map((proposal) => (
              <div key={proposal.id} className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{proposal.freelancer?.name ?? "自由职业者"}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatMoney(proposal.proposedAmount)} · {proposal.estimatedDays} 天
                    </p>
                  </div>
                  <Badge>{proposal.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{proposal.coverLetter}</p>
                {proposal.status === "submitted" ? (
                  <div className="mt-4 flex gap-2">
                    <Button disabled={isBusy} onClick={() => acceptProposal(proposal.id)} type="button">
                      <ShieldCheck size={16} />
                      接受报价
                    </Button>
                    <Button disabled={isBusy} onClick={() => rejectProposal(proposal.id)} type="button" variant="secondary">
                      拒绝
                    </Button>
                  </div>
                ) : null}
              </div>
            )) : (
              <div className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                暂时还没有报价。项目发布后，自由职业者提交的报价会出现在这里。
              </div>
            )}
          </div>
        </div>
      ) : null}

      {project.contract ? (
        <div className="mt-6 rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted)]">合约金额</p>
              <p className="mt-1 text-xl font-semibold">{formatMoney(project.contract.amount)}</p>
            </div>
            <Badge>{project.contract.status}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            客户：{project.contract.client?.name ?? "客户"} · 自由职业者：{project.contract.freelancer?.name ?? "自由职业者"}
          </p>
        </div>
      ) : null}

      {project.contract?.deliverables.length ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-lg font-semibold">交付物</h3>
          {project.contract.deliverables.map((deliverable) => (
            <div key={deliverable.id} className="rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 font-medium">
                  <FileCheck2 size={16} />
                  {deliverable.status === "approved" ? "已验收" : "待验收"}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                  <Clock size={13} />
                  {new Date(deliverable.createdAt).toLocaleString("zh-CN")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{deliverable.message}</p>
              {isClientOwner && deliverable.status === "submitted" ? (
                <Button className="mt-4 w-full" disabled={isBusy} onClick={() => approveDeliverable(deliverable.id)} type="button">
                  验收并完成项目
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {isSelectedFreelancer && project.contract?.status !== "completed" ? (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">提交交付物</h3>
          <Textarea value={deliverableMessage} onChange={(event) => setDeliverableMessage(event.target.value)} placeholder="说明本次交付内容、验收重点和后续建议" />
          <Textarea value={fileUrls} onChange={(event) => setFileUrls(event.target.value)} placeholder="交付物链接，每行一个 URL" />
          <Button className="w-full" disabled={isBusy} onClick={submitDeliverable} type="button">
            <Send size={16} />
            提交交付物
          </Button>
        </div>
      ) : null}

      {approvedDeliverable && project.contract && currentUserId && !hasReviewed ? (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">完成评价</h3>
          <Input min={1} max={5} value={rating} onChange={(event) => setRating(event.target.value)} type="number" />
          <Textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="写下这次合作的体验" />
          <Button className="w-full" disabled={isBusy} onClick={submitReview} type="button">
            <Star size={16} />
            提交评价
          </Button>
        </div>
      ) : null}

      {submittedDeliverable && !isClientOwner ? (
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">交付物已提交，等待客户验收。</p>
      ) : null}

      {message ? <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{message}</p> : null}
    </Card>
  );
}
