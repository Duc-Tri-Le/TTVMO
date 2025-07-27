import express from "express";
import { addGrade, deleteGrade, getGrade, hideGrade } from "../controllers/gradeController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const gradeRouter = express.Router();

//nguoi quan ly
gradeRouter.put("/addGrade", addGrade);
gradeRouter.patch("/hideGrade", hideGrade);
gradeRouter.delete("/deleteGrade", deleteGrade);
gradeRouter.get("/getGrade", getGrade);

export default gradeRouter