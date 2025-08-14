import { pool } from "../config/database.js";
import { getInstructorCourseModel } from "./courseModel.js";

const statisticInstructorModel = async (course_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // danh sach hoc vien
    const sql1 = `
    WITH list_student AS (
      SELECT 
          tk.tenDangNhap,
          tk.taiKhoan_id
      FROM taikhoan tk
      JOIN dangkikhoahoc dkkh 
          ON tk.taiKhoan_id = dkkh.user_id
      WHERE dkkh.course_id = ?
  ),
  latest_exam_per_user_per_test AS (
      SELECT
          ue.*,
          ROW_NUMBER() OVER (
              PARTITION BY ue.user_id, ue.exam_id
              ORDER BY ue.start_at DESC
          ) AS rn
      FROM userExam ue
  )
  SELECT 
      ls.tenDangNhap, 
      ls.taiKhoan_id,
      AVG(lue.score) AS avg_score,
      AVG(lue.duration) AS avg_duration,
      SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
      COUNT(DISTINCT lue.user_exam_id) AS total_user_exam
  FROM list_student ls
  LEFT JOIN latest_exam_per_user_per_test lue 
      ON lue.user_id = ls.taiKhoan_id 
      AND lue.rn = 1
  LEFT JOIN userAnswer ua 
      ON ua.user_exam_id = lue.user_exam_id
left join baikiemtra bkt on bkt.BKT_id = lue.exam_id
  WHERE bkt.khoaHoc_id = ?
  GROUP BY 
      ls.taiKhoan_id, 
      ls.tenDangNhap
    `
    const [rows] = await connection.execute(sql1, [course_id, course_id]);

    //diem trung binh theo tung bai cua khoa hoc
    const sql2 = `
          WITH latest_exam_per_user_per_test AS (
            SELECT
                ue.*,
                ROW_NUMBER() OVER (
                    PARTITION BY ue.user_id, ue.exam_id
                    ORDER BY ue.start_at DESC
                ) AS rn
            FROM userExam ue
        )
        SELECT 
            bkt.BKT_id,
            bkt.tenBKT, 
            bkt.number_question,
            AVG(leu.score) AS avg_score,
            AVG(leu.duration) AS avg_duration,
            SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
            COUNT(DISTINCT leu.user_id) AS total_user_exam,
            COUNT(DISTINCT leu.user_exam_id) AS total_exam
        FROM latest_exam_per_user_per_test leu
        JOIN baikiemtra bkt 
            ON leu.exam_id = bkt.BKT_id
        LEFT JOIN userAnswer ua 
            ON ua.user_exam_id = leu.user_exam_id
        WHERE bkt.khoaHoc_id = ?
          AND leu.rn = 1
        GROUP BY bkt.BKT_id, bkt.tenBKT, bkt.number_question;
  
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
    const sql2 = `
          WITH latest_exam_per_user_per_test AS (
            SELECT
                ue.*,
                ROW_NUMBER() OVER (
                    PARTITION BY ue.user_id, ue.exam_id
                    ORDER BY ue.start_at DESC
                ) AS rn
            FROM userExam ue
        )
        SELECT 
            tk.tenDangNhap, 
            tk.taiKhoan_id,
            bkt.BKT_id,
            bkt.tenBKT, 
            bkt.number_question,
            AVG(lue.score) AS avg_score,
            AVG(lue.duration) AS avg_duration,
            SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
            COUNT(DISTINCT lue.user_exam_id) AS total_user_exam
        FROM taikhoan tk
        LEFT JOIN latest_exam_per_user_per_test lue 
            ON lue.user_id = tk.taiKhoan_id 
            AND lue.rn = 1
        LEFT JOIN baikiemtra bkt 
            ON lue.exam_id = bkt.BKT_id
        LEFT JOIN userAnswer ua 
            ON ua.user_exam_id = lue.user_exam_id
        WHERE bkt.khoaHoc_id = ? 
          AND tk.taiKhoan_id = ?
        GROUP BY 
            tk.taiKhoan_id, 
            tk.tenDangNhap, 
            bkt.BKT_id, 
            bkt.tenBKT, 
            bkt.number_question;  
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
