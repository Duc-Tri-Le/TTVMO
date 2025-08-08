import express from "express";
import {
  acceptCourse,
  addCourse,
  deleteCourse,
  getCourse,
  getLevelEducation,
  getProgram,
  getSubject,
  getUSerCourse,
  hideCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { upload } from "../config/uploadConfig.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const courseRouter = express.Router();
//giang vien
courseRouter.put(
  "/addCourse",
  authMiddleware,
  authorizeRoles("giang_vien"),
  upload.single("image"),
  addCourse
);
courseRouter.patch(
  "/hideCourse",
  authMiddleware,
  authorizeRoles("giang_vien"),
  hideCourse
);
courseRouter.patch(
  "/updateCourse",
  authMiddleware,
  authorizeRoles("giang_vien"),
  upload.single("image"),
  updateCourse
);
courseRouter.delete(
  "/deleteCourse",
  authMiddleware,
  authorizeRoles("giang_vien"),
  deleteCourse
);
//nguoi qua ly
courseRouter.patch("/acceptCourse",authMiddleware, authorizeRoles("nguoi_quan_ly"), acceptCourse);

//all
courseRouter.get("/getCourse", getCourse);
courseRouter.get("/userCourse", getUSerCourse);
courseRouter.get("/levelEducation", getLevelEducation);
courseRouter.get("/program", getProgram);
courseRouter.get("/subject", getSubject);

export default courseRouter;
