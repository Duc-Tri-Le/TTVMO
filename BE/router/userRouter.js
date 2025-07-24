import { loginUserController, registerUSer } from "../controllers/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/loginUser", loginUserController);
userRouter.put("/registerUser", registerUSer);

export {userRouter}