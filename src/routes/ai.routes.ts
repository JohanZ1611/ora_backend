import { Router } from "express";
import {
  getDailyTip,
  getReportSummary,
  getSuggestedBudgets,
  processVoiceAction,
} from "../controllers/ai.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/daily-tip", getDailyTip);
router.get("/report-summary", getReportSummary);
router.get("/suggest-budgets", getSuggestedBudgets);
router.post("/voice-action", processVoiceAction);

export default router;