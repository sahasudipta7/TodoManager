import { Router } from "express";
import { createSubTodo } from "../contollers/subTodo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/createSubTodo").post(verifyJWT,createSubTodo)

export default router