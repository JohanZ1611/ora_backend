import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  targetAmount: z.number().positive("El monto objetivo debe ser mayor a 0"),
  savedAmount: z.number().min(0).default(0),
  deadline: z.string().datetime().optional(),
});

export const updateGoalSchema = createGoalSchema.partial();

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;