import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { CreateBudgetInput, UpdateBudgetInput } from "../schemas/budget.schema";

export const getBudgets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { month, year } = req.query;

    const where: Record<string, unknown> = { userId: req.userId };
    if (month) where["month"] = parseInt(month as string);
    if (year) where["year"] = parseInt(year as string);

    const budgets = await prisma.budget.findMany({
      where,
      orderBy: { category: "asc" },
    });

    const now = new Date();
    const currentMonth = parseInt(month as string) || now.getMonth() + 1;
    const currentYear = parseInt(year as string) || now.getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            userId: req.userId,
            category: budget.category,
            type: "EXPENSE",
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        });

        const spentAmount = spent._sum.amount ?? 0;
        const percentage = Math.min((spentAmount / budget.limitAmount) * 100, 100);

        return { ...budget, spentAmount, percentage };
      })
    );

    return res.json({ ok: true, data: budgetsWithSpent });
  } catch (err) {
    next(err);
  }
};

export const createBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateBudgetInput;

    const existing = await prisma.budget.findUnique({
      where: {
        userId_category_month_year: {
          userId: req.userId!,
          category: body.category,
          month: body.month,
          year: body.year,
        },
      },
    });

    if (existing) throw new AppError("Ya existe un presupuesto para esta categoría en ese mes", 400);

    const budget = await prisma.budget.create({
      data: { ...body, userId: req.userId! },
    });

    return res.status(201).json({
      ok: true,
      message: "Presupuesto creado exitosamente",
      data: budget,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.budget.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Presupuesto no encontrado", 404);

    const budget = await prisma.budget.update({
      where: { id },
      data: req.body as UpdateBudgetInput,
    });

    return res.json({
      ok: true,
      message: "Presupuesto actualizado exitosamente",
      data: budget,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.budget.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Presupuesto no encontrado", 404);

    await prisma.budget.delete({ where: { id } });

    return res.json({ ok: true, message: "Presupuesto eliminado exitosamente" });
  } catch (err) {
    next(err);
  }
};