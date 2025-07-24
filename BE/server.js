import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./config/database.js";

const app = express();
const port = 4000;

//middle
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

//connect data
await connectDatabase();

app.listen(port, () => {
    console.log("da khoi tao", port)
})