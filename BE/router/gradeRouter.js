import express from "express";
import { addGrade, deleteGrade, getGrade, hideGrade } from "../controllers/gradeController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const gradeRouter = express.Router();

//nguoi quan ly
gradeRouter.put("/addGrade", authMiddleware, authorizeRoles("quan_ly"), addGrade);
gradeRouter.patch("/hideGrade",  authMiddleware, authorizeRoles("quan_ly"), hideGrade);
gradeRouter.delete("/deleteGrade",  authMiddleware, authorizeRoles("quan_ly"), deleteGrade);
gradeRouter.get("/getGrade",  authMiddleware, authorizeRoles("quan_ly"), getGrade);

export default gradeRouter