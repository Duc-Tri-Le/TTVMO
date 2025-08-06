import express from "express";
import { addCourse, deleteCourse, getCouser, hideCourse, updateCourse } from "../controllers/courseController.js";
import { upload } from "../config/uploadConfig.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const courseRouter = express.Router();
//giang vien
courseRouter.put("/addCourse",authMiddleware, authorizeRoles("giang_vien"), upload.single("image"), addCourse);
courseRouter.patch("/hideCourse", authMiddleware, authorizeRoles("giang_vien"), hideCourse);
courseRouter.patch("/updateCourse", authMiddleware, authorizeRoles("giang_vien"), upload.single("image"), updateCourse);
courseRouter.delete("/deleteCourse", authMiddleware, authorizeRoles("giang_vien"), deleteCourse);

//all
courseRouter.get("/getCourse", getCouser);

export default courseRouter;