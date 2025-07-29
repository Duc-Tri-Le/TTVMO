import {
  addCourseModel,
  deleteCourseModel,
  getCourseModel,
  hideCourseModel,
  updateCourseModel,
} from "../model/courseModel.js";

const addCourse = async (req, res) => {
  try {
    let { list_gv_id, ifCourse } = req.body;
    const file = req?.file;

    if (typeof ifCourse === "string") {
      ifCourse = JSON.parse(ifCourse);
    }

    if (typeof list_gv_id === "string") {
      list_gv_id = JSON.parse(list_gv_id);
    }
    if(file) {
      ifCourse.hinhanh = `/${file.filename}`
    }

    const { message } = await addCourseModel(list_gv_id, ifCourse);
    return res.json(message);
  } catch (error) {
    console.log(error);
  }
};

const hideCourse = async (req, res) => {
  try {
    const { khoaHoc_id } = req.body;
    const { message } = await hideCourseModel(khoaHoc_id);
    return res.json(message);
  } catch (error) {
    console.log(error);
  }
};

const deleteCourse = async (req, res) => {
  const {khoaHoc_id} = req.query;
  const { message } = await deleteCourseModel(khoaHoc_id);

  return res.json(message);
};

const getCouser = async (req, res) => {
  const { result } = await getCourseModel();
  return res.json(result);
};

const updateCourse = async (req, res) => {
  try {
    const {khoaHoc_id} = req.query;
    let { ifCourse, list_gv_id } = req.body;
   
    const file = req?.file;

    if (typeof ifCourse === "string") {
      ifCourse = JSON.parse(ifCourse);
    }
    if(typeof list_gv_id === "string") {
      list_gv_id = JSON.parse(list_gv_id)
    }
    if (file) {
      const dgdan = `/${file.filename}`;
      ifCourse.hinhanh = dgdan;
    }
   
    const { message } = await updateCourseModel(list_gv_id, khoaHoc_id,ifCourse);
    return res.json(message);
  } catch (error) {
    console.log(error);
  }
};

export { addCourse, hideCourse, deleteCourse, getCouser, updateCourse };
