import { pool } from "../config/database.js";

const addCourseTypeModel = async (tenLKH, ngayTao, CTH_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const checkCourseType = `select tenLKH from loaikhoahoc where tenLKH = ? and CTH_id = ?`;
    const [check] = await connection.execute(checkCourseType, [tenLKH, CTH_id]);
    if(check.length > 0) {
      connection.rollback();
      throw new Error("ten loai khoa hoc da ton tai")
    }
    const insertCourseType = `insert into loaikhoahoc(tenLKH, ngayTao, CTH_id) values(?,?, ?)`;
    await connection.execute(insertCourseType, [tenLKH, ngayTao, CTH_id]);

    connection.commit();
    return {
      message: "them loai khoa hoc thanh cong",
    };
  } catch (error) {
    connection.rollback()
    return {
      message : error.message
    }
  }finally{
    connection.release();
  }
};

const hideCourseTypeModel = async (LHK_id) => {
  const hideCourseType = `update loaikhoahoc set is_active = 0 where LHK_id = ?`;

  const [hide_CourseType] = await pool.execute(hideCourseType, [LHK_id]);

  return {
    result: {
      hide_CourseType: hide_CourseType.affectedRows,
    },
  };
};

const deleteCourseTypeModel = async (LHK_id) => {
  const deleteCourseType = `delete from caphoc where LHK_id = ?`;
  await pool.execute(deleteCourseType, [LHK_id]);
  return {
    message: "xoa loai khoa hoc thanh cong",
  };
};

const getCourseTypeModel = async () => {
  const getCourseType = `select * from loaikhoahoc`;
  const [CourseType] = await pool.execute(getCourseType);
  return {
    result: {
      message: "lay danh sach loai khoa hoc thanh cong",
      CourseType: CourseType,
    },
  };
};

export {
  addCourseTypeModel,
  hideCourseTypeModel,
  deleteCourseTypeModel,
  getCourseTypeModel,
};
