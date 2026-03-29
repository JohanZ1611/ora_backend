import { Router } from "express";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../controllers/budgets.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { createBudgetSchema, updateBudgetSchema } from "../schemas/budget.schema";

const router = Router();
router.use(authenticate);
router.get("/", getBudgets);
router.post("/", validate(createBudgetSchema), createBudget);
router.put("/:id", validate(updateBudgetSchema), updateBudget);
router.delete("/:id", deleteBudget);
export default router;