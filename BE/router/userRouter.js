import { acceptInstructor, getDetailUser, getUSers, loginAdmin, loginUserController, registerUSer, updateUser } from "../controllers/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

import express from "express";

const userRouter = express.Router();


userRouter.post("/loginUser", loginUserController);
userRouter.put("/registerUser", registerUSer);
userRouter.post("/loginAdmin", loginAdmin);
userRouter.get("/getDetailUser", getDetailUser);
userRouter.patch("/updateUser", updateUser)

// nguoi quan ly
userRouter.patch("/acceptInstructor", authMiddleware, authorizeRoles("nguoi_quan_ly"), acceptInstructor)
userRouter.get("/getUsers",authMiddleware, authorizeRoles("nguoi_quan_ly"), getUSers);

export {userRouter}