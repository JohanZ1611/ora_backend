import { Router } from "express";
import { getSummary, getUpcomingPayments } from "../controllers/reports.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/upcoming-payments", getUpcomingPayments);

export default router;