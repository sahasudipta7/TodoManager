import { Router } from "express";
import { createSubTodo,toggleSubTodoComplete,getSubTodo,updateSubTodoContent,deleteSubTodo } from "../contollers/subTodo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/createSubTodo").post(verifyJWT,createSubTodo)
router.route("/toggleSubTodoComplete").post(verifyJWT,toggleSubTodoComplete)
router.route("/getSubTodo").post(verifyJWT,getSubTodo)
router.route("/deleteSubTodo").post(verifyJWT,deleteSubTodo)
router.route("/updatesubTodoContent").post(verifyJWT,updateSubTodoContent)


export default router