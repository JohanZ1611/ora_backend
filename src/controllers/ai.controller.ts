import type { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import type { AuthRequest } from "../middlewares/auth.middleware";
import { AppError } from "../middlewares/error.middleware";
import {
  generateDailyTip,
  generateReportSummary,
  suggestBudgets,
  interpretVoiceAction,
} from "../services/ai.service";

export const getDailyTip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { currency: true },
    });

    const [incomeResult, expenseResult, topCategoryResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: req.userId, type: "INCOME", date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId: req.userId, type: "EXPENSE", date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["category"],
        where: { userId: req.userId, type: "EXPENSE", date: { gte: startOfMonth } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 1,
      }),
    ]);

    const tip = await generateDailyTip({
      totalIncome: incomeResult._sum.amount ?? 0,
      totalExpense: expenseResult._sum.amount ?? 0,
      topCategory: topCategoryResult[0]?.category ?? "General",
      currency: user?.currency ?? "COP",
    });

    return res.json({ ok: true, data: { tip } });
  } catch (err) {
    next(err);
  }
};

export const getReportSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Se requieren startDate y endDate", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { currency: true },
    });

    const where = {
      userId: req.userId,
      date: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    };

    const [incomeResult, expenseResult, byCategory] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["category"],
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
      }),
    ]);

    const totalIncome = incomeResult._sum.amount ?? 0;
    const totalExpense = expenseResult._sum.amount ?? 0;

    const summary = await generateReportSummary({
      period: `${startDate} al ${endDate}`,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory: byCategory.map((c) => ({
        category: c.category,
        amount: c._sum.amount ?? 0,
      })),
      currency: user?.currency ?? "COP",
    });

    return res.json({ ok: true, data: { summary } });
  } catch (err) {
    next(err);
  }
};

export const getSuggestedBudgets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { currency: true },
    });

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const history = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId: req.userId,
        type: "EXPENSE",
        date: { gte: threeMonthsAgo },
      },
      _avg: { amount: true },
      orderBy: { _avg: { amount: "desc" } },
    });

    const suggestions = await suggestBudgets({
      history: history.map((h) => ({
        category: h.category,
        avgAmount: h._avg.amount ?? 0,
      })),
      currency: user?.currency ?? "COP",
    });

    return res.json({ ok: true, data: suggestions });
  } catch (err) {
    next(err);
  }
};

export const processVoiceAction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== "string") {
      throw new AppError("Se requiere el transcript de voz", 400);
    }

    const result = await interpretVoiceAction(transcript);

    return res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
};