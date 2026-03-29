import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Ora API funcionando 🟢" });
});

export default router;