import { Router } from "express";
// import { prisma } from "../config/prisma";
import {
  getDailyTip,
  getReportSummary,
  getSuggestedBudgets,
  processVoiceAction,
} from "../controllers/ai.controller";
import { authenticate } from "../middlewares/auth.middleware";
// import { sendReminderEmail } from "../services/resend.service";


const router = Router();

router.use(authenticate);

router.get("/daily-tip", getDailyTip);
router.get("/report-summary", getReportSummary);
router.get("/suggest-budgets", getSuggestedBudgets);
router.post("/voice-action", processVoiceAction);

// router.post("/test-email", authenticate, async (req: any, res, next) => {
//   try {
//     await sendReminderEmail({
//       to: "johan16zulu@gmail.com", // tu email real verificado en Resend
//       userName: "Johan",
//       reminderType: "debt",
//       itemName: "Tarjeta de crédito",
//       amount: 600000,
//       dueDate: new Date("2026-04-15"),
//       currency: "COP",
//     });

//     res.json({ ok: true, message: "Correo enviado" });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;