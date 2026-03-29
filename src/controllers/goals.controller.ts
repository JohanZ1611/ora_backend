import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { CreateGoalInput, UpdateGoalInput } from "../schemas/goal.schema";

export const getGoals = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const goalsWithProgress = goals.map((g) => ({
      ...g,
      percentage: Math.min((g.savedAmount / g.targetAmount) * 100, 100),
      remaining: Math.max(g.targetAmount - g.savedAmount, 0),
    }));

    return res.json({ ok: true, data: goalsWithProgress });
  } catch (err) {
    next(err);
  }
};

export const createGoal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateGoalInput;

    const goal = await prisma.goal.create({
      data: {
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        userId: req.userId!,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Meta creada exitosamente",
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

export const updateGoal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Meta no encontrada", 404);

    const body = req.body as UpdateGoalInput;

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
      },
    });

    return res.json({
      ok: true,
      message: "Meta actualizada exitosamente",
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Meta no encontrada", 404);

    await prisma.goal.delete({ where: { id } });

    return res.json({ ok: true, message: "Meta eliminada exitosamente" });
  } catch (err) {
    next(err);
  }
};