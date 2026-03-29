import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  date: z.string().datetime("Fecha inválida"),
  done: z.boolean().default(false),
});

export const updateTodoSchema = createTodoSchema.partial();

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;