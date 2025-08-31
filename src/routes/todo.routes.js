import { Router } from "express";
import { createTodo,getTodo } from "../contollers/todo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/createTodo").post(verifyJWT,createTodo)
router.route("/getTodo").post(verifyJWT,getTodo)

export default router