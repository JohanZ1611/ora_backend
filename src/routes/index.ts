import { Router } from "express";
import authRoutes from "./auth.routes";
import transactionRoutes from "./transactions.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Ora API funcionando 🟢" });
});

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);

export default router;