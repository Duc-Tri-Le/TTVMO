import { pool } from "../config/database.js";
import fs from  "fs";
import path from "path";
import { __dirname, __filename } from "../uploads/url.js";
import { connect } from "http2";

const addReviewModel = async (ifReview, ifImage) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const review_id = await insertReview(connection, ifReview);

    ifImage.map((image) => {
      return [review_id, image.link_image];
    });

    await insertImageReview (connection, ifImage);

    connection.commit();
    return {
      message : "them danh gia thanh cong"
    }
  } catch (error) {
    connection.rollback();
  }
};

const updateReviewModel = async (review_id, ifReview, ifImage) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    if(ifReview) {
      await updateReview(connection, review_id, ifReview);
    }
    if(ifImage) {
      await update_image_review(connection, review_id, ifImage);
    }

    connection.commit();
    return {message : "cap nhat review thanh cong"}
  } catch (error) {
    console.log(error);
    connection.rollback()
  }
}

const deleteReviewModel = async (review_id) => {
  const deleteReview = `delete from review where review_id = ?`;
  await pool.execute(deleteReview, [review_id]);
}

const insertReview = async (connection, ifReview) => {
  const fields = [];
  const values = [];
  const daugiatri = [];

  for (const key in ifReview) {
    if (ifReview[key] !== undefined) {
      fields.push(key);
      values.push(ifReview[key]);
      daugiatri.push("? ");
    }
  }
  const sql = `insert into review(${fields.join(",")}) values(${values.join(
    ", "
  )})`;
  const [result] = await connection.execute(insertReview, values);
  return result.insertId;
};

const insertImageReview = async (connection, ifImage) => {
    const insertImage = `insert into image_review(review_id, link_image) values (?, ?)`;
    await connection.query(insertImage, [ifImage])
};

const updateReview = async (connection, review_id, ifReview) =>{
  
  const fields = [];
  const values = [];

  for(const key in ifReview) {
    if(ifReview !== undefined){
      fields.push(`${key} = ?`);
      values.push(ifReview[key])
    }
  }
  values.push(review_id)

  const updateReview = `update review set ${fields.join(", ")} where review_id = ?`;
  await connection.execute(updateReview, values);
}

const update_image_review = async (connection, review_id, ifImage) => {
  const select_link_image = `select link_image from image_review where review_id = ?`;
  const [link_images] = await connection.execute(select_link_image);
  link_images.map((link_image) => {
    const path_image = path.join(__dirname, "images", link_image.link_image);
    if(fs.existsSync(path_image)){
      fs.unlinkSync(path_image);
    }
  }) 
  ifImage.map((link_image) => {
    return [review_id, link_image]
  });
  await insertImageReview(connection, ifReview)
}

export  {addReviewModel, updateReviewModel, deleteReviewModel}