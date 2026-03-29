import { Router } from "express";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../controllers/todos.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo.schema";

const router = Router();
router.use(authenticate);
router.get("/", getTodos);
router.post("/", validate(createTodoSchema), createTodo);
router.put("/:id", validate(updateTodoSchema), updateTodo);
router.delete("/:id", deleteTodo);
export default router;