import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?86)?1[3-9]\d{9}$/, "请输入有效的中国大陆手机号");

export const registerSchema = z.object({
  role: z.enum(["client", "freelancer"]),
  name: z.string().min(2),
  phone: phoneSchema,
  code: z.string().trim().regex(/^\d{4,8}$/, "请输入短信验证码")
});

export const loginSchema = z.object({
  phone: phoneSchema,
  code: z.string().trim().regex(/^\d{4,8}$/, "请输入短信验证码")
});

export const sendSmsCodeSchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(["login", "register"])
});

export const projectSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string().min(2),
  budgetMin: z.coerce.number().int().positive(),
  budgetMax: z.coerce.number().int().positive(),
  skillsRequired: z.array(z.string().min(1)).min(1),
  expectedDeliverables: z.array(z.string().min(1)).default([]),
  imageUrls: z.array(z.string().min(1)).default([]),
  deadline: z.coerce.date()
}).refine((input) => input.budgetMax >= input.budgetMin, {
  message: "最高预算不能低于最低预算",
  path: ["budgetMax"]
});

export const proposalSchema = z.object({
  coverLetter: z.string().min(20),
  proposedAmount: z.coerce.number().int().positive(),
  estimatedDays: z.coerce.number().int().positive()
});

export const deliverableSchema = z.object({
  message: z.string().min(5),
  fileUrls: z.array(z.string().url()).default([])
});

export const reviewSchema = z.object({
  contractId: z.string().min(1),
  revieweeId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5)
});

export const freelancerProfileSchema = z.object({
  title: z.string().trim().min(2).max(40),
  bio: z.string().trim().min(10).max(300),
  skills: z.array(z.string().trim().min(1)).min(1).max(12),
  hourlyRate: z.coerce.number().int().min(0).max(100000).optional(),
  portfolioUrls: z.array(z.string().url()).max(6).default([])
});
