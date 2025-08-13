import { pool } from "../config/database.js";

const addExerciseModel = async (ifExercise, ifQuestions) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // console.log(ifExercise);
    const exercise_id = await insertExercise(connection, ifExercise);
    // console.log(exercise_id);
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
    ANY_VALUE(tk.tenDangNhap) AS tenDangNhap,
    COUNT(ch.cauHoi_id) AS soCauHoi

    FROM baikiemtra bkt
    LEFT JOIN khoahoc kh ON kh.khoaHoc_id = bkt.khoaHoc_id
    LEFT JOIN taikhoan tk ON tk.taiKhoan_id = bkt.nguoiTao_id
    LEFT JOIN cauhoi ch ON ch.BKT_id = bkt.BKT_id
    
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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const sql = `
    SELECT 
    ch.cauHoi_id,
    ANY_VALUE(ch.tenCauHoi) AS tenCauHoi,
    ANY_VALUE(ch.answer_id_correct) AS answer_id_correct,
    GROUP_CONCAT(ctl.CTL_id) AS answer_id,
    GROUP_CONCAT(ctl.noiDung) AS answer_content
    FROM cauhoi ch
    JOIN cautraloi ctl 
        ON ch.cauHoi_id = ctl.cauHoi_id
    WHERE ch.BKT_id = ?
    GROUP BY ch.cauHoi_id;
    `;
    const [result] = await connection.execute(sql, [BKT_id]);
   
    connection.commit()
    return result;
  } catch (error) {
    console.log(error);
    await connection.rollback();
  }finally{
    connection.release()
  }
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
    // console.log("question : ", question);
    const [result] = await connection.execute(insertQuestion, [
      exercise_id,
      question.tenCauHoi,
    ]);
    const question_id = result.insertId;
    // console.log(question_id);
    if (question.ifAnswers) {
      await insertAnswer(
        connection,
        question.ifAnswers,
        question_id,
        question.correctAnswerIndex
      );
    }
  }
};

const insertAnswer = async (
  connection,
  ifAnswers,
  question_id,
  correctAnswerIndex
) => {
  const insertAnswer = `insert into cautraloi(cauHoi_id, noiDung) values(?,?)`;
  // console.log(ifAnswers);
  for (let i = 0; i < ifAnswers.length; i++) {
    const [answer] = await connection.execute(insertAnswer, [
      question_id,
      ifAnswers[i],
    ]);
    const answer_id = answer.insertId;
    // console.log(answer_id);
    if (i === correctAnswerIndex) {
      const sql = `update cauhoi set answer_id_correct = ? where cauHoi_id = ?`;
      await connection.execute(sql, [answer_id, question_id]);
    }
  }
};

const startExamModel = async (
  user_id,
  exam_id,

) => {
  const insertUserExam = `insert into userExam(user_id, exam_id) values(?,?)`;
  const [exam] = await pool.execute(insertUserExam, [
    user_id,
    exam_id,

  ]);
  return { message: "bat dau lam bai", user_exam_id: exam.insertId };
};

const selectAnswerModel = async (
  connection,
  user_exam_id,
  userAnswer
) => {
  try {
    for(const key in userAnswer){
      
    }
    const sql = `insert into userAnswer(answer_id, question_id, user_exam_id) value (?,?,?)`
    await connection.query();
  } catch (error) {
    throw error;
  }
};

const submitExamModel = async (
  user_exam_id,
    userAnswer
) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await selectAnswerModel(
      connection,
      user_exam_id,
      userAnswer
    );

    const selectAllCorrect = `select 
    count(*) as number_correct

    from userAnswer

    where user_exam_id = ? and is_correct = 1

    group by user_exam_id`;

    const [allCorrect] = await connection.execute(selectAllCorrect, [
      user_exam_id,
    ]);
    const number_correct = allCorrect[0].number_correct;
    // console.log('====================================');
    // console.log(number_correct);
    // console.log('====================================');
    const getUserExam = `select 
    number_question, start_at, time_limit
    
    from userExam     
    where user_exam_id = ?`;

    const [userExam] = await connection.execute(getUserExam, [user_exam_id]);
    console.log("====================================");
    console.log(userExam);
    console.log("====================================");
    //score
    const score = number_correct / userExam[0].number_question;
    //time
    const start_at = new Date(userExam[0].start_at);
    const now = new Date();
    const durationMs = now - start_at.getTime();
    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const duration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const insertUserExam = `update userExam set score = ?, duration = ? where user_exam_id = ?`;
    await connection.execute(insertUserExam, [score, duration, user_exam_id]);

    await connection.commit();
    return {
      message: "hoan thanh bai thi",
      score,
      duration,
    };
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    await connection.rollback();
  } finally {
    connection.release();
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
  getDetailExerciseModel,
  startExamModel,
  submitExamModel,
};
