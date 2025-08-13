import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import { userRouter } from "./router/userRouter.js";
import gradeRouter from "./router/gradeRouter.js";
import programRouter from "./router/programRouter.js";
import courseRouter from "./router/courseRouter.js";
import courseTypeRouter from "./router/courseTypeRouter.js";
import lessonRouter from "./router/lessonRouter.js";
import documentRouter from "./router/documentRouter.js";
import exerciseRouter from "./router/exerciseRouter.js";
import reviewRouter from "./router/reviewRouter.js";
import paymentRouter from "./payment/payment.js";

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
app.use("/uploads", express.static("uploads"));
app.use("/api/grade", gradeRouter);
app.use("/api/program", programRouter);
app.use("/api/courseType", courseTypeRouter);
app.use("/api/course", courseRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/document", documentRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/review", reviewRouter);
app.use("/api", paymentRouter);

app.listen(port, () => {
    console.log("da khoi tao", port)
})