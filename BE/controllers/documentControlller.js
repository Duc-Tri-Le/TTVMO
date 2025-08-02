import { addDocumentModel, deleteDocumentModel } from "../model/documentModel.js";

const addDocument = async (req, res) => {
    let {ifDocument} = req.body;
    const file = req.file;
    if(typeof ifDocument === "string"){
        ifDocument = JSON.parse(ifDocument);
    }
    ifDocument.duongdantep = `/${file.filename}`;
    const {BG_id} = req.query;

    const {message} = await addDocumentModel(ifDocument, BG_id);
    return res.json(message);
}

const deleteDocument = async (req, res) =>{
    const {TL_id} =  req.query;
    const {message} = await deleteDocumentModel(TL_id);
    return res.json(message)
}
export {addDocument, deleteDocument}