import express from "express";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";
import { addCourseType, hideCourseType, deleteCourseType, getCourseType } from "../controllers/courseTypeController.js";

const courseTypeRouter = express.Router();

//nguoi quan ly
courseTypeRouter.put("/addCourseType", addCourseType);
courseTypeRouter.patch("/hideCourseType", hideCourseType);
courseTypeRouter.delete("/deleteCourseType", deleteCourseType);
courseTypeRouter.get("/getCourseType", getCourseType);

export default courseTypeRouter