import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).default("ONCE"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().optional(),
  date: z.string().datetime("Fecha inválida"),
  dueDate: z.string().datetime().optional(),
  reminderOn: z.boolean().default(false),
  receiptUrl: z.string().url().optional(),
  groupId: z.string().uuid().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const getTransactionsSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().optional(),
  frequency: z.enum(["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  groupId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).default("1"),
  limit: z.string().regex(/^\d+$/).default("20"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;