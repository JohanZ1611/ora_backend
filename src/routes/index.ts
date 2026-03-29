import { Router } from "express";
import authRoutes from "./auth.routes";
import transactionRoutes from "./transactions.routes";
import groupRoutes from "./groups.routes";
import budgetRoutes from "./budgets.routes";
import goalRoutes from "./goals.routes";
import debtRoutes from "./debts.routes";
import todoRoutes from "./todos.routes";
import reportRoutes from "./reports.routes";
import aiRoutes from "./ai.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Ora API funcionando 🟢" });
});

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/groups", groupRoutes);
router.use("/budgets", budgetRoutes);
router.use("/goals", goalRoutes);
router.use("/debts", debtRoutes);
router.use("/todos", todoRoutes);
router.use("/reports", reportRoutes);
router.use("/ai", aiRoutes);

export default router;