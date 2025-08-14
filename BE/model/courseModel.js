import { pool } from "../config/database.js";
import path from "path";
import fs from "fs";
import { __filename, __dirname } from "../uploads/url.js";

const addCourseModel = async (ifCourse) => {
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

const acceptCourseModel = async (khoaHoc_id) => {
  const acceptCourse = `update khoahoc set trangThai = 'chap_nhan' where khoaHoc_id = ?`;
  await pool.execute(acceptCourse, [khoaHoc_id]);
  return {
    message: "chap nhan khoa hoc thanh cong",
  };
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
    any_value(lhk.tenLKH) as tenLKH, 
    any_value(lhk.LKH_id) as LKH_id,
    any_value(kh.khoaHoc_id) as khoaHoc_id,
    any_value(kh.tenKhoaHoc) as tenKhoaHoc, 
    any_value(kh.giaca) as giaca, 
    any_value(kh.hanDangKy) as hanDangKy, 
    any_value(kh.ngayBatDau) as ngayBatDau, 
    any_value(kh.ngayKetThuc) as ngayKetThuc, 
    any_value(kh.mota) as mota, 
    any_value(kh.trangThai) as trangThai, 
    any_value(kh.hinhanh) as hinhanh, 
    any_value(kh.is_active) as is_active, 
    any_value(kh.soHVTD) as soHVTD, 
    any_value(kh.ngayTao) as ngayTao,
    any_value(cth.ten_CTH) as ten_CTH,
    any_value(cth.CTH_id) as CTH_id,
    any_value(ch.tenCapHoc) as tenCapHoc,
    any_value(ch.capHoc_id) as capHoc_id,
    count(dkkh.user_id) as soSVHT,
    group_concat(distinct tk.tenNguoiDung order by tk.tenNguoiDung asc) as giang_vien,
    group_concat(dkkh.user_id) AS danh_sach_hoc_vien

  from khoahoc kh
  left join loaikhoahoc lhk on lhk.LKH_id = kh.LKH_id
  left join chuongtrinhhoc cth on lhk.CTH_id = cth.CTH_id
  left join caphoc ch on ch.capHoc_id = cth.capHoc_id
  left join taikhoan tk on tk.taiKhoan_id = kh.gv_tao
  left join dangkikhoahoc dkkh on dkkh.course_id = kh.khoaHoc_id
  
  group by kh.khoaHoc_id
  order by ngayTao desc;
    `;

  const [result] = await pool.execute(getCourse);
  return {
    result: {
      message: "danh sach khoa hoc",
      course: result,
    },
  };
};

const updateCourseModel = async (khoaHoc_id, ifCourse) => {
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

    await connection.commit();
    return {
      message: "cap nhat thanh cong",
    };
  } catch (error) {
    await connection.rollback();
  } finally {
    connection.release();
  }
};

const getUSerCourseModel = async (user_id) => {
  const sql = `select 
      ANY_VALUE(kh.tenKhoaHoc) as tenKhoaHoc,
      kh.khoaHoc_id, 
      ANY_VALUE(kh.ngayBatDau) as ngayBatDau,
      ANY_VALUE(kh.ngayKetThuc) as ngayKetThuc, 
      ANY_VALUE(kh.moTa) as moTa, 
      ANY_VALUE(kh.soHVTD) as soHVTD,
      group_concat(dkkh.user_id) AS danh_sach_hoc_vien,
      count(dkkh.user_id) as  HVHT,
      any_value(kh.giaca) as giaca,
      any_value(tk.tenDangNhap) as giang_vien,
      any_value(tk.taiKhoan_id) as gv_id

    from khoahoc kh
    join dangkikhoahoc dkkh on dkkh.course_id = kh.khoaHoc_id
    join taikhoan tk on tk.taiKhoan_id = kh.gv_tao

    where dkkh.user_id = ?
    GROUP BY kh.khoaHoc_id;
  `;
  const [rows] = await pool.execute(sql, [user_id]);
  return {
    result: rows,
  };
};

const getInstructorCourseModel = async (gv_id) => {
  const sql = `select
  any_value(tk.taiKhoan_id) as gv_id, 
  any_value(tk.tenDangNhap)as giang_vien ,
  ANY_VALUE(kh.tenKhoaHoc) as tenKhoaHoc,
  kh.khoaHoc_id, 
  any_value(kh.giaca) as giaca,
  ANY_Value(kh.hanDangKy) as hanDangKy,
  ANY_Value(kh.ngayTao) as ngayTao,
  ANY_VALUE(kh.ngayBatDau) as ngayBatDau,
  ANY_VALUE(kh.ngayKetThuc) as ngayKetThuc, 
  ANY_VALUE(kh.moTa) as moTa, 
  ANY_VALUE(kh.soHVTD) as soHVTD,
  group_concat(dkkh.user_id) AS danh_sach_hoc_vien,
  count(dkkh.user_id) as  HVHT
  from khoahoc kh
  left join dangkikhoahoc dkkh on dkkh.course_id = kh.khoaHoc_id
  join taikhoan tk on tk.taiKhoan_id = kh.gv_tao
    where gv_tao = ?
    group by kh.khoaHoc_id`;
  const [rows] = await pool.execute(sql, [gv_id]);
  return rows;
};

const getLevelEducationModel = async () => {
  const sql = `select * from caphoc`;
  const [rows] = await pool.execute(sql);
  return rows;
};

const getProgramModel = async (capHoc_id) => {
  const sql = `select * from chuongtrinhhoc where capHoc_id = ?`;
  const [rows] = await pool.execute(sql, [capHoc_id]);
  return rows;
};

const getSubjectModel = async (CTH_id) => {
  const sql = `select * from loaikhoahoc where CTH_id = ?`;
  const [rows] = await pool.execute(sql, [CTH_id]);
  return rows;
};

export {
  addCourseModel,
  hideCourseModel,
  deleteCourseModel,
  getCourseModel,
  updateCourseModel,
  getUSerCourseModel,
  getLevelEducationModel,
  getProgramModel,
  getSubjectModel,
  acceptCourseModel,
  getInstructorCourseModel,
};
