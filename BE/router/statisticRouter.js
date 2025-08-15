import express from "express";
import { statisticAdmin, statisticInstructor, statisticStudent } from "../controllers/statisticController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";
const statisticRouter = express.Router();

statisticRouter.get("/instructor", authMiddleware, authorizeRoles("giang_vien"), statisticInstructor);
statisticRouter.get("/student", statisticStudent);
statisticRouter.get("/admin", authMiddleware, authorizeRoles("nguoi_quan_ly"), statisticAdmin);

export default statisticRouter;