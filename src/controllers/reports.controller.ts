import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import type { AuthRequest } from "../middlewares/auth.middleware";

export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    const where: Record<string, unknown> = { userId: req.userId };

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter["gte"] = new Date(startDate as string);
      if (endDate) dateFilter["lte"] = new Date(endDate as string);
      where["date"] = dateFilter;
    }

    const [incomeResult, expenseResult, transactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.findMany({
        where,
        select: { category: true, amount: true, type: true, date: true },
      }),
    ]);

    const totalIncome = incomeResult._sum.amount ?? 0;
    const totalExpense = expenseResult._sum.amount ?? 0;

    const byCategory = Object.values(
      transactions.reduce((acc: Record<string, { category: string; amount: number; type: string }>, t) => {
        const key = `${t.type}_${t.category}`;
        if (!acc[key]) acc[key] = { category: t.category, amount: 0, type: t.type };
        acc[key]!.amount += t.amount;
        return acc;
      }, {})
    );

    const byMonth = Object.values(
      transactions.reduce((acc: Record<string, { month: string; income: number; expense: number }>, t) => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
        if (t.type === "INCOME") acc[month]!.income += t.amount;
        else acc[month]!.expense += t.amount;
        return acc;
      }, {})
    ).sort((a, b) => a.month.localeCompare(b.month));

    return res.json({
      ok: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: incomeResult._count + expenseResult._count,
        byCategory,
        byMonth,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUpcomingPayments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const [transactions, groups, debts] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: req.userId,
          reminderOn: true,
          dueDate: { gte: today, lte: nextWeek },
        },
        select: { id: true, description: true, amount: true, dueDate: true, category: true },
      }),
      prisma.group.findMany({
        where: {
          userId: req.userId,
          reminderOn: true,
          dueDate: { gte: today, lte: nextWeek },
        },
        select: { id: true, name: true, dueDate: true, category: true },
      }),
      prisma.debt.findMany({
        where: {
          userId: req.userId,
          reminderOn: true,
          dueDate: { gte: today, lte: nextWeek },
        },
        select: { id: true, name: true, totalAmount: true, paidAmount: true, dueDate: true },
      }),
    ]);

    const upcoming = [
      ...transactions.map((t) => ({
        id: t.id,
        name: t.description ?? t.category,
        amount: t.amount,
        dueDate: t.dueDate,
        type: "transaction",
      })),
      ...groups.map((g) => ({
        id: g.id,
        name: g.name,
        amount: null,
        dueDate: g.dueDate,
        type: "group",
      })),
      ...debts.map((d) => ({
        id: d.id,
        name: d.name,
        amount: d.totalAmount - d.paidAmount,
        dueDate: d.dueDate,
        type: "debt",
      })),
    ].sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    return res.json({ ok: true, data: upcoming });
  } catch (err) {
    next(err);
  }
};