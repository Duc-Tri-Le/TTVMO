import { pool } from "../config/database.js";

const addDocumentModel = async (ifDocument) => {
    const fields = [];
    const values = [];
    const dauGiaTri = [];
    for (const key in ifDocument) {
      if (ifDocument[key] !== undefined) {
        fields.push(key);
        values.push(ifDocument[key]);
        dauGiaTri.push("?");
      }
    };
    const addDocument = `insert into tailieu(${fields.join(", ")}) values(${dauGiaTri.join(", ")})`;
    await pool.execute(addDocument, values);
    return {
        message : "them tai lieu thanh cong"
    }
}

const deleteDocumentModel = async (TL_id) => {
    const deleteDocument = `delete from tailieu where TL_id = ?`;
    await pool.execute(deleteDocument, [TL_id]);
    return {
        message : "xoa tai lieu thanh cong"
    }
}
export  {addDocument, deleteDocumentModel}