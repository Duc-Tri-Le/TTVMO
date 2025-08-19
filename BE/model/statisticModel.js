import { pool } from "../config/database.js";
import { getInstructorCourseModel } from "./courseModel.js";

const statisticInstructorModel = async (course_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // danh sach hoc vien va diem tot nhat cua mn
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
                    ORDER BY ue.score desc, ue.duration asc, ue.start_at DESC
                ) AS rn
            FROM userExam ue
        )
        SELECT 
            ls.tenDangNhap, 
            ls.taiKhoan_id,
            AVG(lue.score) AS avg_score,
            SEC_TO_TIME(AVG(TIME_TO_SEC(lue.duration))) AS avg_duration,
            SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
            COUNT(DISTINCT lue.exam_id) AS total_exam
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
        ORDER BY total_exam desc, avg_score DESC, avg_duration ASC;
    `;
    const [rows] = await connection.execute(sql1, [course_id, course_id]);

    //diem trung binh theo tung bai cua khoa hoc
    const sql2 = `
      WITH best_exam_per_user_per_test AS (
        SELECT
            ue.*,
            ROW_NUMBER() OVER (
                PARTITION BY ue.user_id, ue.exam_id
                ORDER BY ue.score DESC, ue.start_at DESC
            ) AS rn
        FROM userExam ue
    )
        SELECT 
            bkt.BKT_id,
            bkt.tenBKT, 
            bkt.number_question,
            AVG(beu.score) AS avg_score,
            SEC_TO_TIME(AVG(TIME_TO_SEC(beu.duration))) AS avg_duration,
            SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
            COUNT(DISTINCT beu.user_exam_id) AS total_exam
        FROM best_exam_per_user_per_test beu
        JOIN baikiemtra bkt 
            ON beu.exam_id = bkt.BKT_id
        LEFT JOIN userAnswer ua 
            ON ua.user_exam_id = beu.user_exam_id
        WHERE bkt.khoaHoc_id = ?
          AND beu.rn = 1
        GROUP BY bkt.BKT_id, bkt.tenBKT, bkt.number_question;  
          `;

    const [result] = await connection.execute(sql2, [course_id]);
    connection.commit();
    return { result, rows };
  } catch (error) {
    connection.rollback();
  } finally {
    connection.release();
  }
};

const statisticStudentModel = async (course_id, user_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    //diem trung binh theo tung bai cua khoa hoc
    const sql2 = `
    WITH best_exam_per_user_per_test AS (
      SELECT
          ue.*,
          ROW_NUMBER() OVER (
              PARTITION BY ue.user_id, ue.exam_id
              ORDER BY ue.score DESC, ue.start_at DESC
          ) AS rn
      FROM userExam ue
  )
  SELECT 
      tk.tenDangNhap, 
      tk.taiKhoan_id,
      bkt.BKT_id,
      bkt.tenBKT, 
      bkt.number_question,
      AVG(beu.score) AS avg_score,
      SEC_TO_TIME(AVG(TIME_TO_SEC(beu.duration))) AS avg_duration,
      SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) AS total_correct_answers,
      COUNT(DISTINCT beu.user_exam_id) AS total_user_exam
  FROM taikhoan tk
  LEFT JOIN best_exam_per_user_per_test beu 
      ON beu.user_id = tk.taiKhoan_id 
     AND beu.rn = 1
  LEFT JOIN baikiemtra bkt 
      ON beu.exam_id = bkt.BKT_id
  LEFT JOIN userAnswer ua 
      ON ua.user_exam_id = beu.user_exam_id
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
};

const statisticAdminModel = async (start_at, end_date, group_by) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    //doanh thu theo thoi gian
    const sql = `SELECT 
      CASE 
          WHEN ? = 'day' THEN DATE_FORMAT(register_date, '%Y-%m-%d')
          WHEN ? = 'week' THEN DATE_FORMAT(register_date, '%x-W%v')
          WHEN ? = 'month' THEN DATE_FORMAT(register_date, '%Y-%m')
          WHEN ? = 'year' THEN DATE_FORMAT(register_date, '%Y')
      END AS thoi_gian,
      COUNT(DISTINCT dkkh.user_id) AS so_nguoi_dang_ky,
      SUM(dkkh.amount_paid) AS doanh_thu_khoa_hoc,
     kh.tenKhoaHoc
        FROM dangkikhoahoc dkkh
       join khoahoc kh on kh.khoaHoc_id = dkkh.course_id
        WHERE register_date BETWEEN ? AND ?
        group by kh.tenKhoaHoc, thoi_gian
        ORDER BY thoi_gian;
    `;
    const [result] = await connection.execute(
      sql,
      [group_by,
      group_by,
      group_by,
      group_by,
      start_at,
      end_date]
    );

    connection.commit();
    return result;
    //lay diem trung binh
  } catch (error) {
    connection.rollback();
  } finally {
    connection.release();
  }
};
export { statisticInstructorModel, statisticStudentModel, statisticAdminModel };
