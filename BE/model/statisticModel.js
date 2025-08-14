import { pool } from "../config/database.js";
import { getInstructorCourseModel } from "./courseModel.js";

const statisticInstructorModel = async (course_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // danh sach hoc vien
    const sql1 = `select 
    tk.tenDangNhap,
    tk.taiKhoan_id

    from taikhoan tk
    join dangkikhoahoc dkkh on tk.taiKhoan_id = dkkh.user_id
    
    where dkkh.course_id = ?
    `
    const [rows] = await connection.execute(sql1, [course_id]);

    //diem trung binh theo tung bai cua khoa hoc
    const sql2 = `select 
      bkt.BKT_id,
      bkt.tenBKT, 
      bkt.number_question,
      AVG(ue.score) AS avg_score,
      AVG(ue.duration) AS avg_duration,
      SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
      COUNT(DISTINCT ue.user_id) AS total_user_exam,
      COUNT(DISTINCT ue.user_exam_id) AS total_exam
      FROM taikhoan tk
        LEFT JOIN userExam ue ON ue.user_id = tk.taiKhoan_id
        left join baikiemtra bkt on ue.exam_id = bkt.BKT_id
        LEFT JOIN userAnswer ua ON ua.user_exam_id = ue.user_exam_id
        where bkt.khoaHoc_id = ?
        group by  bkt.BKT_id, bkt.tenBKT, bkt.number_question
      `;

    const [result] = await connection.execute(sql2, [course_id]);
    connection.commit();
    return {result, rows};
  } catch (error) {
    connection.rollback();
  } finally {
    connection.release();
  }
};

const statisticStudentModel = async ( course_id, user_id) =>{
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    //diem trung binh theo tung bai cua khoa hoc
    const sql2 = `select tk.tenDangNhap, tk.taiKhoan_id,
      bkt.BKT_id,
      bkt.tenBKT, 
      bkt.number_question,
      AVG(ue.score) AS avg_score,
      AVG(ue.duration) AS avg_duration,
      SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
      COUNT(DISTINCT ue.user_exam_id) AS total_user_exam
      FROM taikhoan tk
        LEFT JOIN userExam ue ON ue.user_id = tk.taiKhoan_id
        left join baikiemtra bkt on ue.exam_id = bkt.BKT_id
        LEFT JOIN userAnswer ua ON ua.user_exam_id = ue.user_exam_id
        where bkt.khoaHoc_id = ? and ue.user_id =? 
        group by tk.taiKhoan_id, tk.tenDangNhap, bkt.BKT_id, bkt.tenBKT, bkt.number_question
      `;

    const [result] = await connection.execute(sql2, [course_id, user_id]);
    connection.commit();
    return result;
  } catch (error) {
    connection.rollback();
  } finally {
    connection.release();
  }
}
export { statisticInstructorModel, statisticStudentModel };
