import { deleteGradeModel } from "../model/gradeModel.js";
import { addProgramModel, deleteProgramModel, getProgramModel, hideProgramModel } from "../model/programModel.js";

const addProgram = async (req, res) => {
    try {
        const {ten_CTH, capHoc_id} = req.body;
        const ngayTao = new Date();
        const {result} = await addProgramModel(ten_CTH, capHoc_id, ngayTao);
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
}


const hidePRogram = async (req, res) => {
    try {
        const {message} = await hideProgramModel(req.query.CTH_id);
        return res.json(message);
    } catch (error) {
        console.log(error);
    }
}

const deleteProgram = async (req, res) => {
    const {CTH_id} = req.query;
    const {message} = await deleteProgramModel(CTH_id);
    return res.json(message)
}

const getProgram = async (req,res) => {
    const {result} = await getProgramModel();
    return res.json(result);
};

export {addProgram, hidePRogram, deleteProgram, getProgram}