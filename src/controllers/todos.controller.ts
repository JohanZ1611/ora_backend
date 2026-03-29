import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { CreateTodoInput, UpdateTodoInput } from "../schemas/todo.schema";

export const getTodos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { date, done } = req.query;

    const where: Record<string, unknown> = { userId: req.userId };

    if (date) {
      const start = new Date(date as string);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date as string);
      end.setHours(23, 59, 59, 999);
      where["date"] = { gte: start, lte: end };
    }

    if (done !== undefined) where["done"] = done === "true";

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return res.json({ ok: true, data: todos });
  } catch (err) {
    next(err);
  }
};

export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateTodoInput;

    const todo = await prisma.todo.create({
      data: {
        ...body,
        date: new Date(body.date),
        userId: req.userId!,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Tarea creada exitosamente",
      data: todo,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.todo.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Tarea no encontrada", 404);

    const body = req.body as UpdateTodoInput;

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
      },
    });

    return res.json({
      ok: true,
      message: "Tarea actualizada exitosamente",
      data: todo,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.todo.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Tarea no encontrada", 404);

    await prisma.todo.delete({ where: { id } });

    return res.json({ ok: true, message: "Tarea eliminada exitosamente" });
  } catch (err) {
    next(err);
  }
};