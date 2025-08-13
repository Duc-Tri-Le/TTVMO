import express from "express";
import { addDocument, deleteDocument } from "../controllers/documentControlller.js";
import { upload } from "../config/uploadConfig.js";
import { authMiddleware, authorizeRoles } from "../middleware/author.js";

const documentRouter = express.Router();

documentRouter.post("/addDocument",  authMiddleware, authorizeRoles("giang_vien"), upload.single("document"), addDocument);
documentRouter.delete("/deleteDocument",  authMiddleware, authorizeRoles("giang_vien"), deleteDocument);

export default documentRouter;