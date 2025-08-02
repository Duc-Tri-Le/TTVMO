import express from "express";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";
import { addCourseType, hideCourseType, deleteCourseType, getCourseType } from "../controllers/courseTypeController.js";

const courseTypeRouter = express.Router();

//nguoi quan ly
courseTypeRouter.put("/addCourseType", authMiddleware, authorizeRoles("quan_ly"), addCourseType);
courseTypeRouter.patch("/hideCourseType",  authMiddleware, authorizeRoles("quan_ly"), hideCourseType);
courseTypeRouter.delete("/deleteCourseType",  authMiddleware, authorizeRoles("quan_ly"), deleteCourseType);
courseTypeRouter.get("/getCourseType",  authMiddleware, authorizeRoles("quan_ly"), getCourseType);

export default courseTypeRouter