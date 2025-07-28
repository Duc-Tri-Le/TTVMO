import {
  addCourseModel,
  deleteCourseModel,
  getCourseModel,
  hideCourseModel,
  updateCourseModel,
} from "../model/courseModel.js";

const addCourse = async (req, res) => {
  try {
    let { list_gv_id, ifCourse, ifLessons, ifDocuments } = req.body;
    const files = req?.files;

    if (typeof ifCourse === "string") {
      ifCourse = JSON.parse(ifCourse);
    }

    if (typeof list_gv_id === "string") {
      list_gv_id = JSON.parse(list_gv_id);
    }

    if (typeof ifLessons === "string") {
      list_gv_id = JSON.parse(ifLessons);
    }

    if (typeof ifDocuments === "string") {
      list_gv_id = JSON.parse(ifDocuments);
    }
    let videoURL = [];
    let documentURL = [];
    if (files) {
      files.map((file) => {
        if (file.fieldname === "image") {
          const image = `${file.filename}`;
          ifCourse.hinhanh = image;
        }else if(file.fieldname === "video"){
          const video = `${file.filename}`;
          videoURL.push(video)
        }else if(file.fieldname === "document"){
          const document = `${file.filename}`;
          documentURL.push(document);
        }
      });
    }
    console.log({ ifCourse, list_gv_id });
    const { message } = await addCourseModel(list_gv_id, ifCourse, ifLessons, ifDocuments,videoURL, documentURL);
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
  const khoaHoc_id = req.query;
  const { message } = await deleteCourseModel(khoaHoc_id);

  return res.json(message);
};

const getCouser = async (req, res) => {
  const { result } = await getCourseModel();
  return res.json(result);
};

const updateCourse = async (req, res) => {
  try {
    let { ifCourse } = req.body;
    const file = req?.file;

    if (typeof ifCourse === "string") {
      ifCourse = JSON.parse(ifCourse);
    }

    if (file) {
      const dgdan = `images/${file.filename}`;
      ifCourse.hinhanh = dgdan;
    }

    const { message } = await updateCourseModel(ifCourse);
    return res.json(message);
  } catch (error) {
    console.log(error);
  }
};

export { addCourse, hideCourse, deleteCourse, getCouser, updateCourse };
