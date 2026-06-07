import { z } from "zod";

export const registerSchema = z.object({
  role: z.enum(["client", "freelancer"]),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const projectSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string().min(2),
  budgetMin: z.coerce.number().int().positive(),
  budgetMax: z.coerce.number().int().positive(),
  skillsRequired: z.array(z.string().min(1)).min(1),
  imageUrls: z.array(z.string().min(1)).default([]),
  deadline: z.coerce.date()
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
