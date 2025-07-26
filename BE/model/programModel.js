import { pool } from "../config/database.js"

const addProgramModel = async (ten_CTT, capHoc_id, ngayTao) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
    } catch (error) {
        
    }
}