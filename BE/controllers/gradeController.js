import { addGradeModel, hideGradeModel } from "../model/gradeModel.js";

const addGrade = async (req, res) =>{
    try {
        const {tenCapHoc} = req.body;
        const {result} = await addGradeModel(tenCapHoc);
        return res.json(result)
    } catch (error) {
        console.log(error);
    }
}

const hideGrade = async(req,res) =>{
    try {
        const {capHoc_id} = req.body;
        const {result}= await hideGradeModel(capHoc_id);
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
}

export {addGrade, hideGrade}