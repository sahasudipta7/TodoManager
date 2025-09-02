import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateUsername,getAllUserTodos } from "../contollers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();
console.log("gonna allow access to user functions")//test
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/changeUserPassword").post(verifyJWT,changeCurrentPassword);
router.route("/getCurrentUser").post(getCurrentUser);
router.route("/updateUsername").post(verifyJWT,updateUsername);
router.route("/getAllUserTodos").post(verifyJWT,getAllUserTodos);
export default router;