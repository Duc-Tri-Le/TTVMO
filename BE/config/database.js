import mysql2 from "mysql2/promise";

const pool =  mysql2.createPool(
    {
        host : "localhost",
        user : "root",
        password : "12345",
        database : "ttvmo"
    }
);

const connectDatabase = async () => {
    await pool.getConnection();
    console.log("ket noi database thanh cong");
}

export {pool, connectDatabase};
