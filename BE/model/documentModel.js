import { pool } from "../config/database.js";
import fs from "fs";
import { __dirname, __filename } from "../uploads/url.js";
import path from "path";

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
    console.log({ addDocument, values });
    const [document] = await connection.execute(addDocument, values);
    console.log(document);

    console.log("them tai lieu thanh cong");
    await connection.commit();
    return {
      message: "them tai lieu thanh cong",
    };
  } catch (error) {
    console.log(error);
    await connection.rollback();
  }
};

const deleteDocumentModel = async (TL_id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const selectPDFurl = `select duongdantep from tailieu where TL_id = ?`;
    const [pdfURL] = await connection.execute(selectPDFurl, [TL_id]);

    const pdfPath = path.join(__dirname, "pdf", pdfURL[0].duongdantep);
    console.log(pdfPath);
    if(fs.existsSync(pdfPath)){
      fs.unlinkSync(pdfPath);
    }

    const deleteDocument = `delete from tailieu where TL_id = ?`;
    await pool.execute(deleteDocument, [TL_id]);

    await connection.commit();
    return {
      message: "xoa tai lieu thanh cong",
    };
  } catch (error) {
    console.log(error);
    connection.rollback()
  }
};
export { addDocumentModel, deleteDocumentModel };
