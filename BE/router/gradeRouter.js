import express from "express";
import { addGrade, hideGrade } from "../controllers/gradeController.js";

const gradeRouter = express.Router;

gradeRouter.put("/addGrade", addGrade);
gradeRouter.patch("/hideGrade", hideGrade);

export default gradeRouter