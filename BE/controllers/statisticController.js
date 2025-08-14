import { json } from "express";
import { statisticInstructorModel, statisticStudentModel } from "../model/statisticModel.js";

const statisticInstructor = async (req, res) => {
    const {course_id} = req.query;
    console.log(course_id);
    const {result, rows} = await statisticInstructorModel(course_id);
    return res.json({result, rows});
}

const statisticStudent = async (req,res) => {
    const {course_id, user_id}  = req.query;
    console.log(course_id, user_id);
    const result = await statisticStudentModel(course_id, user_id);
    return res.json(result)
}

export {statisticInstructor, statisticStudent}