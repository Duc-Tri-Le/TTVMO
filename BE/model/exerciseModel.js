import { pool } from "../config/database.js";

const addExerciseModel = async (ifExercise, ifQuestions) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const exercise_id = await insertExercise(connection, ifExercise);

        await insertQuestion(connection, ifQuestions, exercise_id);
        
        await connection.commit();
        return {message : "them bai kiemt ra tanh cong"}
    } catch (error) {
        console.log(error.message);
        connection.rollback()
    }
}

const deleteExerciseModel = async (BKT_id) => {
    const deleteExercise = `delete from baikiemtra where BKT_id = ?`;
    await pool.execute(deleteExercise, [BKT_id]);
    return {
        message : "xoa bai kiem tra thanh cong"
    }
}

const deleteQUestionModel = async (cauHoi_id) =>{
    const deleteQuestion = `delete from cauhoi where cauHoi_id = ?`;
    await pool.execute(deleteQUestion, [cauHoi_id]);
}

const deleteAnswerModel =  async (CTL_id) => {
    const deleteAnswer = `delete from cautraloi where CTL_id = ?`;
    await pool.execute(deleteAnswer, [CTL_id]);
}

const addQuestionModel = async (BKT_id, ifQuestions) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await insertQuestion(connection, ifQuestions, BKT_id);

        connection.commit();
        return {message : "them cau hoi thanh cong"}
    } catch (error) {
        console.log(error);
        connection.rollback()
    }
}

const addAnswerModel = async (cauHoi_id, ifAnswers) => {
    await insertAnswer(ifAnswers, cauHoi_id);
    return {message : "them cau traa loi thnah cong"}
}

const insertExercise = async (connection, ifExercise) => {
    const fields = [];
    const values = [];
    const daugiatri = [];

    for(const key in ifExercise){
        if(ifExercise[key] !== undefined){
            fields.push(key);
            values.push(ifExercise[key]);
            daugiatri.push("?");
        }
    }

    const insertExercise = `insert into baikiemtra(${fields.join(", ")}) values(${daugiatri.join(", ")})`;
    const [result] = await connection.execute(insertExercise, values);
    
    return result.insertId;
}

const insertQuestion = async (connection, ifQuestions,exercise_id) => {
    const insertQuestion = `insert into cauhoi(BKT_id, tenCauHoi) values (?, ?)`;

    for(const question in ifQuestions){
        const [result] = await connection.execute(insertQuestion,[question.tenCauHoi, exercise_id]);
        const question_id = result.insertId;
        await insertAnswer(connection, result.ifAnswers, question_id);
    }
}

const insertAnswer = async (connection, ifAnswers, question_id) => {
    const insertAnswer = `insert into cautraloi(cauHoi_id, noiDung, dungSai) values(?,?,?)`;
    for(const answer in ifAnswers){
        await connection.execute(insertAnswer, [question_id, ifAnswers.noiDung, ifAnswers.dunSai ? 1: 0])
    }
}


export {addExerciseModel, addAnswerModel, addQuestionModel, deleteExerciseModel, deleteAnswerModel, deleteQUestionModel}