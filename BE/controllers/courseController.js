import { addCourseModel, deleteCourseModel, getCourseModel, hideCourseModel } from "../model/courseModel.js";


const addCourse = async (req, res) =>{
    try {
        const {list_gv_id, ifCourse} = req.body;
        const file = req.file;
        const image = `images/${file.filename}`;
        ifCourse.hinhanh = image;
        const {message} = await addCourseModel(list_gv_id, ifCourse);
        return res.json(message)
    } catch (error) {
        console.log(error);
    }
}

const hideCourse = async(req,res) =>{
    try {
        const {khoaHoc_id} = req.body;
        const {message}= await hideCourseModel(khoaHoc_id);
        return res.json(message);
    } catch (error) {
        console.log(error);
    }
}

const deleteCourse = async (req,res) => {
    const khoaHoc_id = req.query;
    const {message} = await deleteCourseModel(khoaHoc_id);

    return res.json(message)
}

const getCouser = async (req,res) => {
    const {result} = await getCourseModel();
    return res.json(result);
}

export {addCourse, hideCourse, deleteCourse, getCouser}