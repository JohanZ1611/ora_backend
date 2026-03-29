import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { CreateTransactionInput, UpdateTransactionInput, GetTransactionsInput } from "../schemas/transaction.schema";

export const getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, category, frequency, groupId, startDate, endDate, page, limit } = req.query as GetTransactionsInput;

    const pageNum = parseInt(page ?? "1");
    const limitNum = parseInt(limit ?? "20");
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { userId: req.userId };

    if (type) where["type"] = type;
    if (category) where["category"] = category;
    if (frequency) where["frequency"] = frequency;
    if (groupId) where["groupId"] = groupId;
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter["gte"] = new Date(startDate);
      if (endDate) dateFilter["lte"] = new Date(endDate);
      where["date"] = dateFilter;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limitNum,
        include: { group: { select: { id: true, name: true, category: true } } },
      }),
      prisma.transaction.count({ where }),
    ]);

    return res.json({
      ok: true,
      data: transactions,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.userId },
      include: { group: { select: { id: true, name: true, category: true } } },
    });

    if (!transaction) throw new AppError("Transacción no encontrada", 404);

    return res.json({ ok: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateTransactionInput;

    const transaction = await prisma.transaction.create({
      data: {
        ...body,
        date: new Date(body.date),
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        userId: req.userId!,
      },
    });

    return res.status(201).json({
      ok: true,
      message: "Transacción creada exitosamente",
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Transacción no encontrada", 404);

    const body = req.body as UpdateTransactionInput;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return res.json({
      ok: true,
      message: "Transacción actualizada exitosamente",
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params["id"] as string;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) throw new AppError("Transacción no encontrada", 404);

    await prisma.transaction.delete({ where: { id } });

    return res.json({ ok: true, message: "Transacción eliminada exitosamente" });
  } catch (err) {
    next(err);
  }
};