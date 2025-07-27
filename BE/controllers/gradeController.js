import { addGradeModel, deleteGradeModel, getGradeModel, hideGradeModel } from "../model/gradeModel.js";

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

const deleteGrade = async (req,res) => {
    const capHoc_id = req.query;
    const {message} = await deleteGradeModel(capHoc_id);

    return res.json(message)
}

const getGrade = async (req,res) => {
    const {result} = await getGradeModel();
    return res.json(result);
}
export {addGrade, hideGrade, deleteGrade, getGrade}