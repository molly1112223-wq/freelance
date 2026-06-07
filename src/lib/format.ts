export function formatMoney(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatProjectStatus(status: string) {
  const labels: Record<string, string> = {
    draft: "草稿",
    published: "招募中",
    inProgress: "进行中",
    completed: "已完成",
    cancelled: "已取消"
  };

  return labels[status] ?? status;
}
