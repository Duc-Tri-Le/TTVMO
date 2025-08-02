import { exerciseModel } from "../model/exerciseModel";

const addExercise = async (req,res) => {
    const {ifExercise, ifQuestions} = req.body;
    const {message} = exerciseModel(ifExercise, ifQuestions);
    res.json(message);
}