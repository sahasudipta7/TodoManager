import { Router } from "express";
import { createSubTodo,toggleSubTodoComplete } from "../contollers/subTodo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/createSubTodo").post(verifyJWT,createSubTodo)
router.route("/toggleSubTodoComplete").post(verifyJWT,toggleSubTodoComplete)

export default router