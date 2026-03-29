import { Router } from "express";
import { getDebts, createDebt, updateDebt, deleteDebt } from "../controllers/debts.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { createDebtSchema, updateDebtSchema } from "../schemas/debt.schema";

const router = Router();
router.use(authenticate);
router.get("/", getDebts);
router.post("/", validate(createDebtSchema), createDebt);
router.put("/:id", validate(updateDebtSchema), updateDebt);
router.delete("/:id", deleteDebt);
export default router;