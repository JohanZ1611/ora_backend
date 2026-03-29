import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { CreateGroupInput, UpdateGroupInput, AddTransactionToGroupInput } from "../schemas/group.schema";

export const getGroups = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const groups = await prisma.group.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: {
        transactions: {
          select: { id: true, amount: true, description: true, date: true },
          orderBy: { date: "desc" },
        },
        _count: { select: { transactions: true } },
      },
    });

    const groupsWithTotal = groups.map((g) => ({
      ...g,
      totalAmount: g.transactions.reduce((sum, t) => sum + t.amount, 0),
    }));

    return res.json({ ok: true, data: groupsWithTotal });
  } catch (err) {
    next(err);
  }
};

export const getGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const group = await prisma.group.findFirst({
      where: { id, userId: req.userId },
      include: {
        transactions: { orderBy: { date: "desc" } },
        _count: { select: { transactions: true } },
      },
    });

    if (!group) throw new AppError("Grupo no encontrado", 404);

    const totalAmount = group.transactions.reduce((sum, t) => sum + t.amount, 0);

    return res.json({ ok: true, data: { ...group, totalAmount } });
  } catch (err) {
    next(err);
  }
};

export const createGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateGroupInput;

    const group = await prisma.group.create({
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        userId: req.userId!,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Grupo creado exitosamente",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.group.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Grupo no encontrado", 404);

    const body = req.body as UpdateGroupInput;

    const group = await prisma.group.update({
      where: { id },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return res.json({
      ok: true,
      message: "Grupo actualizado exitosamente",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.group.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Grupo no encontrado", 404);

    await prisma.group.delete({ where: { id } });

    return res.json({ ok: true, message: "Grupo eliminado exitosamente" });
  } catch (err) {
    next(err);
  }
};

export const addTransactionToGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const groupId = req.params["id"] as string;

    const group = await prisma.group.findFirst({
      where: { id: groupId, userId: req.userId },
    });

    if (!group) throw new AppError("Grupo no encontrado", 404);

    const body = req.body as AddTransactionToGroupInput;

    const transaction = await prisma.transaction.create({
      data: {
        amount: body.amount,
        description: body.description,
        date: new Date(body.date),
        receiptUrl: body.receiptUrl,
        type: group.type,
        category: group.category,
        frequency: "ONCE",
        reminderOn: group.reminderOn,
        dueDate: group.dueDate,
        userId: req.userId!,
        groupId,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Movimiento agregado al grupo exitosamente",
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};