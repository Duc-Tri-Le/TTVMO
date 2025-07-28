import { pool } from "../config/database.js";

const addCourseModel = async ( list_gv_id, ifCourse, ifLessons, ifDocuments,videoURL, documentURL) => {
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
    const ngayTao = new Date();
    const gv_id = list_gv_id.map((gv_id) => [khoaHoc_id, gv_id, ngayTao]);
    const insertKH_GV = `insert into gv_kh(khoaHoc_id, gv_id, ngayTao) values ?`;
    await connection.query(insertKH_GV, [gv_id]);

    //bang bai giang
    //bang tai lieu
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
  const deleteCourse = `delete from khoahoc where khoaHoc_id = ?`;
  await pool.execute(deleteCourse, [khoaHoc_id]);

  return {
    message: "xoa khoa hoc thanh cong",
  };
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

const updateCourseModel = async ({khoaHoc_id, ...ifCourse}) =>{
  const fields = [];
  const values = [];
  
  for(const key in ifCourse) {
    if(ifCourse[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(`${ifCourse[key]}`)
    }
  }
  values.push(khoaHoc_id)

  const updateCourse = `update khoahoc set ${fields.join(", ")} where khoaHoc_id  = ?`;
  await pool.execute(updateCourse, values);
  return {
    message : "cap nhat thanh cong"
  }
}
export { addCourseModel, hideCourseModel, deleteCourseModel, getCourseModel, updateCourseModel };
