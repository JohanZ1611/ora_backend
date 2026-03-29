import { Router } from "express";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goals.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";

const router = Router();
router.use(authenticate);
router.get("/", getGoals);
router.post("/", validate(createGoalSchema), createGoal);
router.put("/:id", validate(updateGoalSchema), updateGoal);
router.delete("/:id", deleteGoal);
export default router;