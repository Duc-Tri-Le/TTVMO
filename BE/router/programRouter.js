import express from "express";
import { addProgram, deleteProgram, getProgram, hidePRogram } from "../controllers/programController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const programRouter = express.Router();

//nguoi quan ly
programRouter.put("/addProgram",  authMiddleware, authorizeRoles("quan_ly"), addProgram);
programRouter.patch("/hideProgram",  authMiddleware, authorizeRoles("quan_ly"), hidePRogram);
programRouter.delete("/deleteProgram",  authMiddleware, authorizeRoles("quan_ly"), deleteProgram);
programRouter.get("/getProgram",  authMiddleware, authorizeRoles("quan_ly"), getProgram);

export default programRouter;