import { acceptInstructor, loginAdmin, loginUserController, registerUSer } from "../controllers/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

import express from "express";

const userRouter = express.Router();

userRouter.post("/loginUser", loginUserController);
userRouter.put("/registerUser", registerUSer);
userRouter.post("/loginAdmin", loginAdmin);
userRouter.patch("/acceptInstructor", authMiddleware, authorizeRoles("nguoi_quan_ly"), acceptInstructor)

export {userRouter}