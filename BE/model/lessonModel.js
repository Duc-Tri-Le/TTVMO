import { get } from "http";
import { pool } from "../config/database.js";
import { __filename, __dirname } from "../uploads/url.js";
import fs from "fs";
import path from "path";

const addLessonModel = async (ifLesson, ifDocument) => {
  KH_id;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const fields = [];
    const values = [];
    const dauGiaTri = [];
    for (const key in ifLesson) {
      if (ifLesson[key] !== undefined) {
        fields.push(key);
        values.push(ifLesson[key]);
        dauGiaTri.push("?");
      }
    }
    const addLesson = `insert into baigiang(${fields.join(
      ", "
    )}) values(${dauGiaTri.join(", ")})`;
    const [lesson] = await connection.execute(addLesson, values);
    const BG_id = lesson.insertId;

    //document
    if (ifDocument && Object.keys(ifDocument).length > 0) {
      await addDocument(connection, ifDocument, BG_id);
    }

    connection.commit();
    return {
      message: "them bai giang thanh cong",
    };
  } catch (error) {
    connection.rollback();
    console.log(error);
  }
};

const deleteLessonModel = async (BG_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectVideoURL = `select videoURl from baigiang where BG_id = ?`;
    const [videoURl] = await connection.execute(selectVideoURL, [BG_id]);

    const filePath = path.join(__dirname, "video", videoURl[0].videoURl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const selectPDFurl = `select duongdantep from tailieu where BG_id = ?`;
    const [pdfURL] = await connection.execute(selectPDFurl, [BG_id]);

    const deleteLesson = `delete from baigiang where BG_id = ?`;
    await connection.execute(deleteLesson, [BG_id]);

    if (pdfURL.length > 0 && pdfURL[0].duongdantep) {
      const pdfPath = path.join(__dirname, "pdf", pdfURL[0].duongdantep);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    connection.commit();
    return {
      message: "xoa bai giang thanh cong",
    };
  } catch (error) {
    console.log(error);
    connection.rollback;
  }
};

const getLessonModel = async (khoaHoc_id, user_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getLesson = `SELECT 
          bg.BG_id, 
          ANY_VALUE(bg.tenBG) AS tenBG, 
          ANY_VALUE(bg.videoURL) AS videoURL, 
          ANY_VALUE(bg.mota) AS mota, 
          ANY_VALUE(bg.ngayTao) AS bg_ngay_tao, 
          ANY_VALUE(bg.mien_phi) AS mien_phi
          
          FROM baigiang bg
          
          WHERE bg.khoaHoc_id = ?
          
          ORDER BY bg_ngay_tao DESC;
          `;
    const [result] = await pool.execute(getLesson, [khoaHoc_id]);
    await connection.commit();
    return { result };
  } catch (error) {
    await connection.rollback();
    console.log(error);
  } finally {
    connection.release();
  }
};

const addDocument = async (connection, ifDocument, khoaHoc_id) => {
  try {
    ifDocument.khoaHoc_id = khoaHoc_id;
    const fields = [];
    const values = [];
    const dauGiaTri = [];
    for (const key in ifDocument) {
      if (ifDocument[key] !== undefined) {
        fields.push(key);
        values.push(ifDocument[key]);
        dauGiaTri.push("?");
      }
    }

    const addDocument = `insert into tailieu(${fields.join(
      ", "
    )}) values(${dauGiaTri.join(", ")})`;
    console.log({ addDocument, values });
    const [document] = await connection.execute(addDocument, values);
    console.log(document);

    console.log("them tai lieu thanh cong");
    await connection.commit();
    return {
      message: "them tai lieu thanh cong",
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  }
};

export { addLessonModel, deleteLessonModel, getLessonModel };
