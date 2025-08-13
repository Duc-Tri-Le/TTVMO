import { pool } from "../config/database.js";
import express from "express";
import createMoMo from "./paymentMoMo.js";

const paymentModel = async (course, user_id) => {
  
  const sql = `insert into dangkikhoahoc(user_id, course_id, amount_paid) value(?,?,?)`;
  const result = await pool.execute(sql, [
    user_id,
    course.khoaHoc_id,
    course.giaca,
  ]);
  
  return result
};

const payment = async (req, res) => {
  const { course, user_id } = req.body;

  const result = await paymentModel(course, user_id);
  return res.json({url : process.env.FRONTEND_URL})
};

const paymentRouter = express.Router();

paymentRouter.put("/payment", payment);

export default paymentRouter;
