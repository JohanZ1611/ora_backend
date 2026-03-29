import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { CreateDebtInput, UpdateDebtInput } from "../schemas/debt.schema";

export const getDebts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const debtsWithProgress = debts.map((d) => ({
      ...d,
      percentage: Math.min((d.paidAmount / d.totalAmount) * 100, 100),
      remaining: Math.max(d.totalAmount - d.paidAmount, 0),
    }));

    return res.json({ ok: true, data: debtsWithProgress });
  } catch (err) {
    next(err);
  }
};

export const createDebt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateDebtInput;

    const debt = await prisma.debt.create({
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        userId: req.userId!,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Deuda creada exitosamente",
      data: debt,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDebt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.debt.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Deuda no encontrada", 404);

    const body = req.body as UpdateDebtInput;

    const debt = await prisma.debt.update({
      where: { id },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return res.json({
      ok: true,
      message: "Deuda actualizada exitosamente",
      data: debt,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDebt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.debt.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Deuda no encontrada", 404);

    await prisma.debt.delete({ where: { id } });

    return res.json({ ok: true, message: "Deuda eliminada exitosamente" });
  } catch (err) {
    next(err);
  }
};