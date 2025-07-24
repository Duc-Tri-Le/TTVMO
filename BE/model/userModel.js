import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

const loginUserModel = async (tenDangNhap, password, email) => {
  const selectUser = `select taiKhoan_id, matKhau from taikhoan where tenDangNhap = ? and email = ?`;
  const [result] = await pool.execute(selectUser, [tenDangNhap, email]);

  const { taiKhoan_id, matKhau } = result[0];
  const isPassword = bcrypt.compare(matKhau, password);
  if (!isPassword) return { result: { err: "mat khau sai" } };

  if (result.length === 0)
    return { result: { err: "thong tin dang nhap sai. Vui long nhap lai" } };
  return {
    result: {
      message: "dang nhap thanh cong",
      TTUser: { tenDangNhap, email, taiKhoan_id },
    },
  };
};

const registerUSerModel = async (tenDangNhap, password, email, role, SDT) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const hashPassword = await bcrypt.hash(password, 12);

    const getVaiTro_id = `select vaiTro_id from vaitro where tenVaiTro = ?`;
    const [vaiTro] = await pool.execute(getVaiTro_id, [role]);
    const vaiTro_id = vaiTro[0].vaiTro_id;

    const insertUser = `insert into taikhoan(tenDangNhap, matKhau, email, SDT, vaiTro_id) values(?,?,?,?, ?)`;
    const [rows] = await pool.execute(insertUser, [
      tenDangNhap,
      hashPassword,
      email,
      SDT,
      vaiTro_id,
    ]);

    const taiKhoan_id = rows.insertId;

    return {
      result: {
        taiKhoan_id,
        role,
        tenDangNhap,
        email,
      },
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  } finally {
    connection.release();
  }
};

const loginAdminModel = async (tenDangNhap, password, email) => {
  const selectAdmin = `select matKhau, vaiTro_id from taikhoan where tenDangNhap = ? and email = ?`;
  const [adminIf] = await pool.execute(selectAdmin, [tenDangNhap, email]);

  const { taiKhoan_id, matKhau } = result[0];
  const isPassword = bcrypt.compare(matKhau, password);
  if (!isPassword) return { result: { err: "mat khau sai" } };

  if (adminIf.length === 0 || adminIf[0]?.vaiTro_id !== 3) {
    return { err: "sai tai khoan" };
  }
  
  return {
    result: {
      message: "dang nhap thanh cong",
      TTUser: { tenDangNhap, email, taiKhoan_id },
    },
  };
};
export { loginUserModel, registerUSerModel };
