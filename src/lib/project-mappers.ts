import type { Project } from "@/components/project-search";

type ProjectLike = {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  skillsRequired: unknown;
  expectedDeliverables?: unknown;
  imageUrls?: unknown;
  deadline: Date | string;
  status: string;
  client?: { name: string } | null;
  _count?: { proposals?: number } | null;
  proposals?: unknown[] | number;
};

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function toProject(item: ProjectLike): Project {
  const proposalCount = typeof item.proposals === "number" ? item.proposals : Array.isArray(item.proposals) ? item.proposals.length : item._count?.proposals ?? 0;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    budgetMin: item.budgetMin,
    budgetMax: item.budgetMax,
    skillsRequired: stringArray(item.skillsRequired),
    expectedDeliverables: stringArray(item.expectedDeliverables),
    imageUrls: stringArray(item.imageUrls),
    deadline: item.deadline instanceof Date ? item.deadline.toISOString() : item.deadline,
    status: item.status,
    client: { name: item.client?.name ?? "已认证客户" },
    proposals: proposalCount
  };
}
