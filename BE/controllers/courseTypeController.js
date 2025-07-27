import { addCourseTypeModel, deleteCourseTypeModel, getCourseTypeModel, hideCourseTypeModel } from "../model/courseTypeModel.js";

const addCourseType = async (req, res) =>{
    try {
        const {tenLHK, CTH_id} = req.body;
        const ngayTao = new Date();
        const {message} = await addCourseTypeModel(tenLHK, ngayTao, CTH_id);
        return res.json(message)
    } catch (error) {
        console.log(error);
    }
}

const hideCourseType = async(req,res) =>{
    try {
        const {capHoc_id} = req.body;
        const {result}= await hideCourseTypeModel(capHoc_id);
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
}

const deleteCourseType = async (req,res) => {
    const capHoc_id = req.query;
    const {message} = await deleteCourseTypeModel(capHoc_id);

    return res.json(message)
}

const getCourseType = async (req,res) => {
    const {result} = await getCourseTypeModel();
    return res.json(result);
}

export {addCourseType, deleteCourseType, hideCourseType, getCourseType}