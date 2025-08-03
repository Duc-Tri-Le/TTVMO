import express from "express";
import { addReview, deleteReview, getReview, updateReview } from "../controllers/reviewController.js";
import {upload} from "../config/uploadConfig.js";

const reviewRouter = express.Router();

reviewRouter.put("/addReview",upload.array("image",3), addReview);
reviewRouter.delete("/deleteReview", deleteReview);
reviewRouter.patch("/updateReview", updateReview);
reviewRouter.get("/getReview", getReview);

export default reviewRouter;