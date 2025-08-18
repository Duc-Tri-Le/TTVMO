import { json } from "express";
import { statisticAdminModel, statisticInstructorModel, statisticStudentModel } from "../model/statisticModel.js";

const statisticInstructor = async (req, res) => {
    const {course_id} = req.query;
    const {result, rows} = await statisticInstructorModel(course_id);
    return res.json({result, rows});
}

const statisticStudent = async (req,res) => {
    const {course_id, user_id}  = req.query;
    const result = await statisticStudentModel(course_id, user_id);
    return res.json(result)
}

const statisticAdmin = async (req, res) => {
    const {start_date, end_date, group_by} = req.query;
    const result = await statisticAdminModel(start_date, end_date, group_by);
    return res.json(result)
}
export {statisticInstructor, statisticStudent, statisticAdmin}