import express from "express";
import { addProgram, deleteProgram, getProgram, hidePRogram } from "../controllers/programController.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const programRouter = express.Router();

//nguoi quan ly
programRouter.put("/addProgram", addProgram);
programRouter.patch("/hideProgram", hidePRogram);
programRouter.delete("/deleteProgram", deleteProgram);
programRouter.get("/getProgram", getProgram);

export default programRouter;