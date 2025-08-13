import { addLessonModel, deleteLessonModel, getLessonModel } from "../model/lessonModel.js";

const addLesson = async (req, res) => {
  try {
    let { ifLesson, ifDocument } = req.body;
    const files = req.files;
    // console.log("file : ", files);
    if (typeof ifLesson === "string") {
      ifLesson = JSON.parse(ifLesson);
    }
    const fileVideo = files.video;
    fileVideo.map((file) => {
      ifLesson.videoURl = `/${file.filename}`;
    });

    if (files.document) {
      if (typeof ifDocument === "string") {
        ifDocument = JSON.parse(ifDocument);
      }
      const fileDocument = files.document;
      fileDocument.map((file) => {
        ifDocument.duongdantep = `/${file.filename}`;
      });
    }
    // console.log({ ifDocument, ifLesson });

    const { message } = await addLessonModel(ifLesson, ifDocument);

    return res.json(message);
  } catch (error) {
    console.log(error);
  }
};

const deleteLesson = async (req,res) => {
  const {BG_id} = req.query;
  const{message} = await deleteLessonModel(BG_id);
  return res.json(message)
}

const getLesson = async (req, res) => {
  const {khoaHoc_id, user_id} =  req.query;
  const {result} = await getLessonModel(khoaHoc_id, user_id);
  return res.json(result)
}
export { addLesson, deleteLesson, getLesson };
