import express from "express";
import { addLesson, deleteLesson } from "../controllers/lessonController.js";
import { upload } from "../config/uploadConfig.js";

const lessonRouter = express.Router();

lessonRouter.put(
  "/addLesson",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addLesson
);

lessonRouter.delete("/deleteLesson", deleteLesson)

export default lessonRouter;
