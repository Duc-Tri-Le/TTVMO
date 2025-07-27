import express from "express";
import { addCourse } from "../controllers/courseController.js";
import { upload } from "../config/uploadConfig.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const courseRouter = express.Router();

courseRouter.put("/addCourse",authMiddleware, authorizeRoles("giang_vien"), upload.single("image"), addCourse);

export default courseRouter;