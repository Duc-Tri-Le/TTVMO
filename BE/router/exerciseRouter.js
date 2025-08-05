import express from "express";
import { addAnswer, addExercise, addQuestion, deleteAnswer, deleteExercise, deleteQUestion, getDetailExercise, getListExerCise, startExam, submitExam } from "../controllers/exerciseController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";
const exerciseRouter = express.Router();

//giang_vien
exerciseRouter.put("/addExercise",authMiddleware, authorizeRoles("giang_vien"), addExercise);
exerciseRouter.put("/addQuestion",authMiddleware, authorizeRoles("giang_vien"), addQuestion);
exerciseRouter.put("/addAnswer",authMiddleware, authorizeRoles("giang_vien"), addAnswer);
exerciseRouter.delete("/deleteExercise",authMiddleware, authorizeRoles("giang_vien"), deleteExercise);
exerciseRouter.delete("/deleteQuestion",authMiddleware, authorizeRoles("giang_vien"), deleteQUestion);
exerciseRouter.delete("/deleteAnswer",authMiddleware, authorizeRoles("giang_vien"), deleteAnswer);
//all
exerciseRouter.get("/listExercise", getListExerCise);
exerciseRouter.get("/detailExercise", getDetailExercise);
exerciseRouter.put("/startExam", startExam);
exerciseRouter.put("/submitExam", submitExam);

export default exerciseRouter;