import { Router } from "express";
import { createSubTodo,markSubTodoComplete } from "../contollers/subTodo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/createSubTodo").post(verifyJWT,createSubTodo)
router.route("/markSubTodoComplete").post(verifyJWT,markSubTodoComplete)

export default router