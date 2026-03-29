import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "La categoría es requerida"),
  dueDate: z.string().datetime().optional(),
  reminderOn: z.boolean().default(false),
  description: z.string().optional(),
});

export const updateGroupSchema = createGroupSchema.partial();

export const addTransactionToGroupSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().optional(),
  date: z.string().datetime("Fecha inválida"),
  receiptUrl: z.string().url().optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type AddTransactionToGroupInput = z.infer<typeof addTransactionToGroupSchema>;