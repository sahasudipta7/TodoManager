import { Router } from "express";
import { createSubTodo,toggleSubTodoComplete,getSubTodo,deleteSubTodo } from "../contollers/subTodo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/createSubTodo").post(verifyJWT,createSubTodo)
router.route("/toggleSubTodoComplete").post(verifyJWT,toggleSubTodoComplete)
router.route("/getSubTodo").post(verifyJWT,getSubTodo)
router.route("/deleteSubTodo").post(verifyJWT,deleteSubTodo)


export default router