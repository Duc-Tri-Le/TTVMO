import mysql2 from "mysql2/promise";

const connection =  mysql2.createPool(
    {
        host : "localhost",
        user : "root",
        password : "12345",
        database : "ttvmo"
    }
).getConnection();

const connectDatabase = async () => {
    connection;
    console.log("ket noi database thanh cong");
}

export {connection, connectDatabase};
