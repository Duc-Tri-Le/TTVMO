import { pool } from "../config/database.js";
import fs from "fs";
import path from "path";
import { __dirname, __filename } from "../uploads/url.js";
import { log } from "console";


const addReviewModel = async (ifReview, ifImage) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
  
    const review_id = await insertReview(connection, ifReview);
   
    // console.log('====================================');
    // console.log(review_id);
    // console.log('====================================');
   if(ifImage.length >  0){
    const imageValues = ifImage.map((image,index) => {
      return [review_id, image];
    });
    // console.log('====================================');
    // console.log(imageValues);
    // console.log('====================================');
    await insertImageReview(connection, imageValues);

   }
    connection.commit();
    return {
      message: "them danh gia thanh cong",
    };
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    connection.rollback();
  } finally{
    connection.release()
  }
};

const updateReviewModel = async (review_id, ifReview) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await updateReview(connection, review_id, ifReview);
    connection.commit();
    return { message: "cap nhat review thanh cong" };
  } catch (error) {
    console.log(error);
    connection.rollback();
  }finally{
    connection.release();
  }
};

const deleteReviewModel = async (review_id) => {
  const connection = await pool.getConnection();
  try {
    const image = `select link_image from image_review where review_id = ?`;
    const [result] = await connection.execute(image, [review_id]);

    if (result.length > 0 && result[0].link_image !== null) {
      const path_image = path.join(__dirname, "images", result[0].link_image);
      if (fs.existsSync(path_image)) {
        fs.unlinkSync(path_image);
      }
    }

    const deleteReview = `delete from review where review_id = ?`;
    await pool.execute(deleteReview, [review_id]);

    connection.commit();
    return {
      message: "xoa danh gia thanh cong",
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  }finally {
    connection.release();
  }
};

const getReviewModel = async (khoaHoc_id) => {
  const getReview = `select rv.review_id, rv.khoaHoc_id, rv.content, rv.create_at, rv.update_at, rv.rating,
  tk.tenDangNhap
   from review rv
   join taikhoan tk on tk.taiKhoan_id = rv.user_id
  where khoaHoc_id = ?`;

  const [reviews] = await pool.execute(getReview, [khoaHoc_id]);

  return {
    message : `danh sach danh gia va phan hoi cua khoa hoc_id : ${khoaHoc_id}`,
    result : reviews
  }
};

const insertReview = async (connection, ifReview) => {
  const fields = [];
  const values = [];
  const daugiatri = [];

  for (const key in ifReview) {
    if (ifReview[key] !== undefined) {
      fields.push(key);
      values.push(ifReview[key]);
      daugiatri.push("?");
    }
  }

  const sql = `insert into review(${fields.join(",")}) values(${daugiatri.join(
    ", "
  )})`;
  const [result] = await connection.execute(sql, values);
  return result.insertId;
};

const insertImageReview = async (connection, imageValues) => {
  const insertImage = `insert into image_review(review_id, link_image) values ?`;
  await connection.query(insertImage, [imageValues]);
};

const updateReview = async (connection, review_id, ifReview) => {
  const fields = [];
  const values = [];

  for (const key in ifReview) {
    if (ifReview !== undefined) {
      fields.push(`${key} = ?`);
      values.push(ifReview[key]);
    }
  }
  values.push(review_id);

  const updateReview = `update review set ${fields.join(
    ", "
  )} where review_id = ?`;
  await connection.execute(updateReview, values);
};

export { addReviewModel, updateReviewModel, deleteReviewModel, getReviewModel };
