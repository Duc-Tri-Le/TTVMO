import express from "express";
import { addAnswer, addExercise, addQuestion, completeExam, deleteAnswer, deleteExercise, deleteQUestion, getDetailExercise, getListExerCise, startExam, submitExam } from "../controllers/exerciseController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";
const exerciseRouter = express.Router();

//giang_vien
exerciseRouter.post("/addExercise",authMiddleware, authorizeRoles("giang_vien"), addExercise);
exerciseRouter.post("/addQuestion",authMiddleware, authorizeRoles("giang_vien"), addQuestion);
exerciseRouter.post("/addAnswer",authMiddleware, authorizeRoles("giang_vien"), addAnswer);
exerciseRouter.delete("/deleteExercise",authMiddleware, authorizeRoles("giang_vien"), deleteExercise);
exerciseRouter.delete("/deleteQuestion",authMiddleware, authorizeRoles("giang_vien"), deleteQUestion);
exerciseRouter.delete("/deleteAnswer",authMiddleware, authorizeRoles("giang_vien"), deleteAnswer);

//all
exerciseRouter.get("/listExercise", getListExerCise);
exerciseRouter.get("/detailExercise", getDetailExercise);
exerciseRouter.post("/startExam", startExam);
exerciseRouter.post("/submitExam", submitExam);
exerciseRouter.get("/complete/exam", completeExam);

export default exerciseRouter;