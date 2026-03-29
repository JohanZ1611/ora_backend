import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  limitAmount: z.number().positive("El límite debe ser mayor a 0"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;