import express from "express";
import {
  acceptCourse,
  addCourse,
  deleteCourse,
  getCourse,
  getInstructorCourse,
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
//nguoi_quan_ly
courseRouter.post(
  "/addCourse",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  upload.single("image"),
  addCourse
);
courseRouter.patch(
  "/hideCourse",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  hideCourse
);
courseRouter.patch(
  "/updateCourse",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  upload.single("image"),
  updateCourse
);
courseRouter.delete(
  "/deleteCourse",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  deleteCourse
);
courseRouter.patch(
  "/acceptCourse",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly"),
  acceptCourse
);

//nguoi quan ly,giang vien
courseRouter.get(
  "/getInstructorCourse",
  authMiddleware,
  authorizeRoles("nguoi_quan_ly","giang_vien"),
  getInstructorCourse
);


//all
courseRouter.get("/getCourse", getCourse);
courseRouter.get("/userCourse", getUSerCourse);
courseRouter.get("/levelEducation", getLevelEducation);
courseRouter.get("/program", getProgram);
courseRouter.get("/subject", getSubject);

export default courseRouter;
