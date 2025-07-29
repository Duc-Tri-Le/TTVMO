import express from "express";
import { addDocument } from "../controllers/documentControlller.js";
import { upload } from "../config/uploadConfig.js";

const documentRouter = express.Router();

documentRouter.put("/addDocument",upload.single("document"), addDocument);

export default documentRouter;