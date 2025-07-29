import { pool } from "../config/database.js";

const addDocumentModel = async (ifDocument, BG_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    ifDocument.BG_id = BG_id;
    const fields = [];
    const values = [];
    const dauGiaTri = [];
    for (const key in ifDocument) {
      if (ifDocument[key] !== undefined) {
        fields.push(key);
        values.push(ifDocument[key]);
        dauGiaTri.push("?");
      }
    }
    
    const addDocument = `insert into tailieu(${fields.join(
      ", "
    )}) values(${dauGiaTri.join(", ")})`;
    console.log({addDocument, values});
    const [document] = await connection.execute(addDocument, values);
    console.log(document);

    console.log("them tai lieu thanh cong");
    await connection.commit();
    return {
      message: "them tai lieu thanh cong",
    };
  } catch (error) {
    console.log(error);
    await connection.rollback()
  }
};

const deleteDocumentModel = async (TL_id) => {
  const deleteDocument = `delete from tailieu where TL_id = ?`;
  await pool.execute(deleteDocument, [TL_id]);
  return {
    message: "xoa tai lieu thanh cong",
  };
};
export { addDocumentModel, deleteDocumentModel };
