export type InspirationItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  role: string;
  image: string;
  tags: string[];
  stats: string;
  briefPrompt: string;
};

export const inspirationCategories = ["精选", "品牌视觉", "UI/UX", "运营增长", "AI 工作流", "内容策划", "产品服务"];

export const inspirationItems: InspirationItem[] = [
  {
    id: "brand-refresh",
    title: "新消费茶饮品牌视觉升级",
    subtitle: "从 Logo、杯套到门店物料的一套轻量化品牌系统。",
    category: "品牌视觉",
    author: "周晓雯",
    role: "品牌视觉设计师",
    image: "/showcase/color-brand-web.svg",
    tags: ["品牌策略", "VI 系统", "包装"],
    stats: "2.8k 浏览 · 146 收藏",
    briefPrompt: "我想做一个新消费品牌视觉升级，需要 Logo、包装和社媒模板。"
  },
  {
    id: "saas-dashboard",
    title: "B2B SaaS 数据看板改版",
    subtitle: "把复杂业务数据整理成适合运营团队每天查看的工作台。",
    category: "UI/UX",
    author: "林青",
    role: "产品设计师",
    image: "/showcase/color-dashboard.svg",
    tags: ["Dashboard", "设计系统", "数据可视化"],
    stats: "4.1k 浏览 · 310 收藏",
    briefPrompt: "我需要优化一个 SaaS 后台首页，让销售和运营能更快看懂数据。"
  },
  {
    id: "ai-onboarding",
    title: "AI 工具新用户引导流程",
    subtitle: "用更短路径解释核心能力，并把第一次生成体验放到首屏。",
    category: "AI 工作流",
    author: "李彦博",
    role: "全栈开发者",
    image: "/showcase/ai-workflow.svg",
    tags: ["AI 产品", "Onboarding", "Prompt"],
    stats: "3.5k 浏览 · 228 收藏",
    briefPrompt: "我想给 AI 工具加一个新手引导，让用户第一次就能成功生成内容。"
  },
  {
    id: "commerce-growth",
    title: "独立电商转化页实验",
    subtitle: "围绕信任、价格锚点和内容种草重做移动端购买路径。",
    category: "运营增长",
    author: "陈思远",
    role: "内容策略顾问",
    image: "/showcase/color-commerce.svg",
    tags: ["增长设计", "移动端", "A/B 测试"],
    stats: "1.9k 浏览 · 102 收藏",
    briefPrompt: "我有一个电商落地页，希望提升转化率并优化手机端购买路径。"
  },
  {
    id: "service-miniapp",
    title: "本地生活服务预约小程序",
    subtitle: "用清晰的服务卡片、预约日历和支付链路减少咨询成本。",
    category: "产品服务",
    author: "王亦",
    role: "小程序开发者",
    image: "/showcase/color-service.svg",
    tags: ["小程序", "预约系统", "支付"],
    stats: "2.2k 浏览 · 119 收藏",
    briefPrompt: "我想做一个本地生活服务预约小程序，需要预约、支付和订单管理。"
  },
  {
    id: "mobile-flow",
    title: "会员社区移动端体验重构",
    subtitle: "把内容浏览、活动报名和会员权益整合成一个连续体验。",
    category: "内容策划",
    author: "许知遥",
    role: "社区运营设计师",
    image: "/showcase/color-mobile-flow.svg",
    tags: ["社区", "内容流", "会员体系"],
    stats: "3.0k 浏览 · 187 收藏",
    briefPrompt: "我需要重构会员社区移动端，让用户更愿意浏览内容和报名活动。"
  }
];
