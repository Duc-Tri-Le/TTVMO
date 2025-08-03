import { pool } from "../config/database.js";

const addExerciseModel = async (ifExercise, ifQuestions) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const exercise_id = await insertExercise(connection, ifExercise);
    console.log(exercise_id);
    await insertQuestion(connection, ifQuestions, exercise_id);

    await connection.commit();
    return { message: "them bai kiem tra tanh cong" };
  } catch (error) {
    console.log(error.message);
    connection.rollback();
  }
};

const deleteExerciseModel = async (BKT_id) => {
  const deleteExercise = `delete from baikiemtra where BKT_id = ?`;
  await pool.execute(deleteExercise, [BKT_id]);
  return {
    message: "xoa bai kiem tra thanh cong",
  };
};

const deleteQUestionModel = async (cauHoi_id) => {
  const deleteQuestion = `delete from cauhoi where cauHoi_id = ?`;
  await pool.execute(deleteQUestion, [cauHoi_id]);
};

const deleteAnswerModel = async (CTL_id) => {
  const deleteAnswer = `delete from cautraloi where CTL_id = ?`;
  await pool.execute(deleteAnswer, [CTL_id]);
};

const addQuestionModel = async (BKT_id, ifQuestions) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await insertQuestion(connection, ifQuestions, BKT_id);

    connection.commit();
    return { message: "them cau hoi thanh cong" };
  } catch (error) {
    console.log(error);
    connection.rollback();
  }
};

const addAnswerModel = async (cauHoi_id, ifAnswers) => {
  await insertAnswer(ifAnswers, cauHoi_id);
  return { message: "them cau traa loi thnah cong" };
};

const getListExerciseModel = async (khoaHoc_id) => {
  const getListExerCise = `SELECT 
    ANY_VALUE(bkt.BKT_id) AS BKT_id, 
    ANY_VALUE(bkt.tenBKT) AS tenBKT, 
    ANY_VALUE(bkt.ngayTao) AS ngayTao,
    ANY_VALUE(kh.tenKhoaHoc) AS tenKhoaHoc,
    ANY_VALUE(tk.tenDangNhap) AS tenDangNhap
  FROM baikiemtra bkt
  LEFT JOIN khoahoc kh ON kh.khoaHoc_id = bkt.khoaHoc_id
  LEFT JOIN taikhoan tk ON tk.taiKhoan_id = bkt.nguoiTao_id
  
  WHERE kh.khoaHoc_id = ?
  GROUP BY bkt.BKT_id
  ORDER BY bkt.ngayTao DESC
  `;

  const [listExercise] = await pool.execute(getListExerCise, [khoaHoc_id]);
  return {
    message: "danh sach bai kiem tra",
    result: listExercise,
  };
};

const getDetailExerciseModel = async (BKT_id) => {
  const getDetail = `SELECT 
  ANY_VALUE(bkt.BKT_id) AS BKT_id, 
  ANY_VALUE(bkt.tenBKT) AS tenBKT, 
  ANY_VALUE(bkt.ngayTao) AS ngayTao,
  ANY_VALUE(ch.cauHoi_id) AS cauHoi_id,
  GROUP_CONCAT(CONCAT(ctl.noiDung, ' (', IF(ctl.dungSai = 1, 'Đúng', 'Sai'), ')') SEPARATOR ', ') AS dapAnGop,
  GROUP_CONCAT( distinct (ch.tenCauHoi)  SEPARATOR ', ') AS cauHoiGop,
  ANY_VALUE(kh.tenKhoaHoc) AS tenKhoaHoc,
  ANY_VALUE(tk.tenDangNhap) AS tenDangNhap
FROM baikiemtra bkt
LEFT JOIN cauhoi ch ON ch.BKT_id = bkt.BKT_id
LEFT JOIN cautraloi ctl ON ctl.cauHoi_id = ch.cauhoi_id
LEFT JOIN khoahoc kh ON kh.khoaHoc_id = bkt.khoaHoc_id
LEFT JOIN taikhoan tk ON tk.taiKhoan_id = bkt.nguoiTao_id

where bkt.BKT_id = ?
GROUP BY ch.cauHoi_id;
  `;
  const [detailExercise] = await pool.execute(getDetail, [BKT_id]);
  return {
    message: "chi tiet bai kiem tra",
    result : detailExercise
  };
};

const insertExercise = async (connection, ifExercise) => {
  const fields = [];
  const values = [];
  const daugiatri = [];
  // console.log("exercise : ", ifExercise);

  for (const key in ifExercise) {
    if (ifExercise[key] !== undefined) {
      fields.push(key);
      values.push(ifExercise[key]);
      daugiatri.push("?");
    }
  }

  // console.log({
  //     fields, values
  // });

  const insertExercise = `insert into baikiemtra(${fields.join(
    ", "
  )}) values(${daugiatri.join(", ")})`;
  const [result] = await connection.execute(insertExercise, values);

  return result.insertId;
};

const insertQuestion = async (connection, ifQuestions, exercise_id) => {
  const insertQuestion = `insert into cauhoi(BKT_id, tenCauHoi) values (?, ?)`;

  for (const question of ifQuestions) {
    console.log("question : ", question);
    const [result] = await connection.execute(insertQuestion, [
      exercise_id,
      question.tenCauHoi,
    ]);
    const question_id = result.insertId;
    if (question.ifAnswers) {
      await insertAnswer(connection, question.ifAnswers, question_id);
    }
  }
};

const insertAnswer = async (connection, ifAnswers, question_id) => {
  const insertAnswer = `insert into cautraloi(cauHoi_id, noiDung, dungSai) values(?,?,?)`;
  for (const answer of ifAnswers) {
    console.log("answer :", answer);
    await connection.execute(insertAnswer, [
      question_id,
      answer.noiDung,
      answer.dungSai,
    ]);
  }
};

export {
  addExerciseModel,
  addAnswerModel,
  addQuestionModel,
  deleteExerciseModel,
  deleteAnswerModel,
  deleteQUestionModel,
  getListExerciseModel,
  getDetailExerciseModel
};
