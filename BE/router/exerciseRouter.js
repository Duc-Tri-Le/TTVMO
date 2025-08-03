import express from "express";
import { addAnswer, addExercise, addQuestion, deleteAnswer, deleteExercise, deleteQUestion, getDetailExercise, getListExerCise } from "../controllers/exerciseController.js";

const exerciseRouter = express.Router();

exerciseRouter.put("/addExercise", addExercise);
exerciseRouter.put("/addQuestion", addQuestion);
exerciseRouter.put("/addAnswer", addAnswer);
exerciseRouter.delete("/deleteExercise", deleteExercise);
exerciseRouter.delete("/deleteQuestion", deleteQUestion);
exerciseRouter.delete("/deleteAnswer", deleteAnswer);
exerciseRouter.get("/listExercise", getListExerCise);
exerciseRouter.get("/detailExercise", getDetailExercise);

export default exerciseRouter;