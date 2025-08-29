import { Router } from "express";
import { createTodo } from "../contollers/todo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/createTodo").post(verifyJWT,createTodo)

export default router