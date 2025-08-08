import {
  acceptInstructor,
  deleteUser,
  getDetailUser,
  getInstructor,
  getStudent,
  lockUser,
  loginAdmin,
  loginUserController,
  registerUSer,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

import express from "express";

const userRouter = express.Router();

userRouter.post("/loginUser", loginUserController);
userRouter.post("/registerUser", registerUSer);
userRouter.post("/loginAdmin", loginAdmin);
userRouter.get("/getDetailUser", getDetailUser);
userRouter.patch("/updateUser", updateUser);

// nguoi quan ly
userRouter.patch(
  "/acceptInstructor",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  acceptInstructor
);
userRouter.get(
  "/get-student",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  getStudent
);
userRouter.get(
  "/getInstructor",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  getInstructor
);
userRouter.delete(
  "/deleteUser",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  deleteUser
);
userRouter.patch(
  "/acceptInstructor",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  acceptInstructor
);
userRouter.patch(
  "/lockUser",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  lockUser
);
userRouter.get("/detail-user", getDetailUser);

export { userRouter };
