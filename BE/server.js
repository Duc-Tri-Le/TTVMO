import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import { userRouter } from "./router/userRouter.js";
import gradeRouter from "./router/gradeRouter.js";

const app = express();
const port = 4000;

//middle
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

//connect data
await connectDatabase();

//api
app.use("/api/user", userRouter);
app.use("/images", express.static("uploads"));
app.use("/api/grade", gradeRouter);

app.listen(port, () => {
    console.log("da khoi tao", port)
})