import { Router } from "express";
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addTransactionToGroup,
} from "../controllers/groups.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createGroupSchema,
  updateGroupSchema,
  addTransactionToGroupSchema,
} from "../schemas/group.schema";

const router = Router();

router.use(authenticate);

router.get("/", getGroups);
router.get("/:id", getGroup);
router.post("/", validate(createGroupSchema), createGroup);
router.put("/:id", validate(updateGroupSchema), updateGroup);
router.delete("/:id", deleteGroup);
router.post("/:id/transactions", validate(addTransactionToGroupSchema), addTransactionToGroup);

export default router;