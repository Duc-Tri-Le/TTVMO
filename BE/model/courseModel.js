import { pool } from "../config/database.js";
import path from "path";
import fs from "fs";
import { __filename, __dirname } from "../uploads/url.js";

const insertGV_KH = async (connection, list_gv_id, khoaHoc_id) => {

    const ngayTao = new Date();
    const gv_id = list_gv_id.map((gv_id) => [khoaHoc_id, gv_id, ngayTao]);
    const insertKH_GV = `insert into gv_kh(khoaHoc_id, gv_id, ngayTao) values ?`;   
    await connection.query(insertKH_GV, [gv_id]);
}

const addCourseModel = async (list_gv_id, ifCourse) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const fields = [];
    const values = [];
    const dauGiaTri = [];

    for (const key in ifCourse) {
      if (ifCourse[key] !== undefined) {
        fields.push(key);
        values.push(ifCourse[key]);
        dauGiaTri.push("?");
      }
    }
    //bang khoahoc
    const insertCourse = `insert into khoahoc(${fields.join(
      ", "
    )}) values(${dauGiaTri.join(", ")})`;
    const [course] = await connection.execute(insertCourse, values);
    if (course.affectedRows === 0) {
      throw new Error("kiem tra lai thong tin khoa hoc");
    }
    const khoaHoc_id = course.insertId;

    //bang gv_kh
    await insertGV_KH(connection, list_gv_id, khoaHoc_id);

    connection.commit();
    return {
      message: "them khoa hoc thanh cong",
    };
  } catch (error) {
    connection.rollback();
    return {
      message: error,
    };
  } finally {
    connection.release();
  }
};

const hideCourseModel = async (khoaHoc_id) => {
  const hideCourse = `update khoahoc set is_active = 0 where khoaHoc_id = ?`;
  await pool.execute(hideCourse, [khoaHoc_id]);

  return {
    message: "an khoa hoc thanh cong",
  };
};

const deleteCourseModel = async (khoaHoc_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
   
    const selectImage = `select hinhanh from khoahoc where khoaHoc_id = ?`;
    const [image] = await connection.execute(selectImage, [khoaHoc_id]);
    
    const imageURL = path.join(__dirname, "images", image[0].hinhanh);
    if (fs.existsSync(imageURL)) {
      fs.unlinkSync(imageURL);
    }

    const deleteCourse = `delete from khoahoc where khoaHoc_id = ?`;
    await connection.execute(deleteCourse, [khoaHoc_id]);

    connection.commit();

    return {
      message: "xoa khoa hoc thanh cong",
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  } finally {
    connection.release();
  }
};

const getCourseModel = async () => {
  const getCourse = `select 
    lhk.tenLKH, 
    gv_kh.gv_id, 
    kh.tenKhoaHoc, kh.giaca, kh.hanDangKy, kh.ngayBatDau, kh.ngayKetThuc, kh.mota, kh.trangThai, kh.hinhanh, kh.is_active, kh.soHVTD, kh.ngayTao,
    cth.ten_CTH,
    ch.tenCapHoc,
    soHVHT.soSVHT
    
    from khoahoc kh
    left join loaikhoahoc lhk on lhk.LKH_id = kh.LKH_id
    left join chuongtrinhhoc cth on lhk.CTH_id = cth.CTH_id
    left join caphoc ch on ch.capHoc_id = cth.capHoc_id
    left join gv_kh on gv_kh.khoaHoc_id = kh.khoaHoc_id
    left join sohvht on sohvht.khoaHoc_id = kh.khoaHoc_id

    order by kh.ngayTao desc
    `;

  const [result] = await pool.execute(getCourse);
  return {
    result: {
      message: "danh sach khoa hoc",
      course: result,
    },
  };
};

const updateCourseModel = async (list_gv_id, khoaHoc_id, ifCourse) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const selectImage = `select hinhanh from khoahoc where khoaHoc_id = ?`;
    const [image] = await connection.execute(selectImage, [khoaHoc_id]);
    const imageURL = path.join(__dirname, "images", image[0].hinhanh);
    if (fs.existsSync(imageURL)) {
      fs.unlinkSync(imageURL);
    }

    const fields = [];
    const values = [];

    for (const key in ifCourse) {
      if (ifCourse[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(`${ifCourse[key]}`);
      }
    }
    values.push(khoaHoc_id);
     const updateCourse = `update khoahoc set ${fields.join(
      ", "
    )} where khoaHoc_id  = ?`;
    await connection.execute(updateCourse, values);

    //xoa bang cu
    const deleteGV_KH = `delete from gv_kh where khoaHoc_id = ?`;
    await connection.execute(deleteGV_KH, [khoaHoc_id]);
   
    //them gv_kh
    await insertGV_KH(connection, list_gv_id, khoaHoc_id);

    await connection.commit();
    return {
      message: "cap nhat thanh cong",
    };
  } catch (error) {
    await connection.rollback();
  }finally{
    connection.release();
  }
};

export {
  addCourseModel,
  hideCourseModel,
  deleteCourseModel,
  getCourseModel,
  updateCourseModel,
};
