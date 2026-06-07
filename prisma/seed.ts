import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.project.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("password123");

  const client = await prisma.user.create({
    data: {
      role: "client",
      name: "星河增长科技",
      email: "client@worklink.dev",
      passwordHash
    }
  });

  const freelancer = await prisma.user.create({
    data: {
      role: "freelancer",
      name: "陈雨桐",
      email: "freelancer@worklink.dev",
      passwordHash,
      freelancerProfile: {
        create: {
          title: "资深产品设计师",
          bio: "擅长 SaaS 后台、设计系统和增长型 onboarding 流程，交付清晰、落地速度快。",
          skills: ["产品设计", "Figma", "设计系统", "用户研究"],
          hourlyRate: 680,
          portfolioUrls: ["https://example.com/portfolio"],
          ratingAvg: 4.9,
          completedProjects: 42,
          availability: "available"
        }
      }
    }
  });

  const project = await prisma.project.create({
    data: {
      clientId: client.id,
      title: "会员增长后台 UI 设计",
      description:
        "需要为会员增长后台设计一套清晰、克制的数据界面，覆盖收入、留存、渠道转化和团队周报。",
      category: "UI/UX 设计",
      budgetMin: 45000,
      budgetMax: 90000,
      skillsRequired: ["UI 设计", "数据可视化", "Figma", "用户体验"],
      imageUrls: ["/showcase/color-dashboard.svg", "/showcase/color-system.svg"],
      deadline: new Date("2026-07-15T00:00:00.000Z"),
      status: "published"
    }
  });

  await prisma.proposal.create({
    data: {
      projectId: project.id,
      freelancerId: freelancer.id,
      coverLetter: "我可以完成数据看板的信息架构、界面设计和设计系统整理，并沉淀可复用组件。",
      proposedAmount: 68000,
      estimatedDays: 21,
      status: "submitted"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
