import { z } from "zod";

export const createDebtSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  totalAmount: z.number().positive("El monto total debe ser mayor a 0"),
  paidAmount: z.number().min(0).default(0),
  dueDate: z.string().datetime().optional(),
  reminderOn: z.boolean().default(false),
});

export const updateDebtSchema = createDebtSchema.partial();

export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;
