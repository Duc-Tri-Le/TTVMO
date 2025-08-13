import express from "express";
import { addLesson, deleteLesson, getLesson } from "../controllers/lessonController.js";
import { upload } from "../config/uploadConfig.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const lessonRouter = express.Router();

lessonRouter.post(
  "/addLesson",
  authMiddleware,
  authorizeRoles("giang_vien"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addLesson
);

lessonRouter.delete(
  "/deleteLesson",
  authMiddleware,
  authorizeRoles("giang_vien"),
  deleteLesson
);

lessonRouter.get("/getLesson", getLesson)

export default lessonRouter;
