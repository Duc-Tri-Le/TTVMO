import { addAnswerModel, addExerciseModel, addQuestionModel, deleteExerciseModel, deleteQUestionModel, getDetailExerciseModel, getListExerciseModel } from "../model/exerciseModel.js";

const addExercise = async (req,res) => {
    const {ifExercise, ifQuestions} = req.body;
    if(typeof ifExercise === "string"){
        ifExercise = JSON.parse(ifExercise);
    };
    if(typeof ifQuestions === "string"){
        ifQuestions = JSON.parse(ifQuestions);
    }
    // console.log({ifExercise, ifQuestions});
    const {message} = await addExerciseModel(ifExercise, ifQuestions);
    res.json(message);
}

const addQuestion = async (req,res) => {
    const {BKT_id,ifQuestions} = req.body;
    if(typeof ifQuestions === "string"){
        ifQuestions = JSON.parse(ifQuestions);
    }
    const {message} = await addQuestionModel(BKT_id, ifQuestions);
    return res.json(message);
}

const addAnswer = async (req, res) => {
    const {cauHoi_id, ifAnswers} = req.body;
    if(typeof ifAnswers === "string"){
        ifAnswers = JSON.parse(ifAnswers);
    }

    const {message} = await addAnswerModel(cauHoi_id, ifAnswers);
    res.json(message);
}

const deleteExercise = async (req,res) => {
    const {BKT_id} = req.body;
    const {message} = await deleteExerciseModel(BKT_id);
    return res.json(message)
}

const deleteQUestion = async (req, res) => {
    const {cauHoi_id} = req.body;
    const {message} = await deleteQUestionModel(cauHoi_id);
    return res.json(message);
}

const deleteAnswer = async (req,res) => {
    const {CTL_id} = req.body;
    const {message} = await deleteExerciseModel(CTL_id);
    return res.json(message)
}

const getListExerCise = async (req, res) => {
    const {message, result} = await getListExerciseModel();
    return res.json({message, result})
}

const getDetailExercise = async (req,res) => {
    const {BKT_id} = req.query;
    const {message, result} = await getDetailExerciseModel(BKT_id);
    return res.json({message, result})
}

export {addExercise, addQuestion, addAnswer, deleteAnswer, deleteQUestion, deleteExercise, getListExerCise, getDetailExercise}