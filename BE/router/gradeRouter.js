import express from "express";
import { addGrade, hideGrade } from "../controllers/gradeController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const gradeRouter = express.Router;

gradeRouter.put("/addGrade", authMiddleware,authorizeRoles("nguoi_quan_ly"), addGrade);
gradeRouter.patch("/hideGrade", authMiddleware, authorizeRoles("nguoi_quan_ly"), hideGrade);

export default gradeRouter