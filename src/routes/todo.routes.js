import { Router } from "express";
import { createTodo,getTodo,toggleTodoComplete } from "../contollers/todo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/createTodo").post(verifyJWT,createTodo)
router.route("/getTodo").post(verifyJWT,getTodo)
router.route("/toggleTodoComplete").post(verifyJWT,toggleTodoComplete)

export default router