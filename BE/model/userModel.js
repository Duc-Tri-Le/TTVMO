import { pool } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = async (role, taiKhoan_id) => {
  const token = jwt.sign({ taiKhoan_id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
  return token;
};

const loginUserModel = async (tenDangNhap, password, email) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectUSer = `select taiKhoan_id, matKhau, vaiTro_id from taikhoan where tenDangNhap = ? and email = ?`;
    const [userIf] = await connection.execute(selectUSer, [tenDangNhap, email]);
    if (userIf.length === 0) {
      return { result: { err: "sai thong tin dang nhap" , success :false} };
    }
    const getTenVaiTro = `select tenVaiTro from vaitro where vaiTro_id = ?`;
    const [tenVaiTro] = await connection.execute(getTenVaiTro, [
      userIf[0].vaiTro_id,
    ]);

    const token = await createToken(
      tenVaiTro[0].tenVaiTro,
      userIf[0].taiKhoan_id
    );

    return {
      success : true,
      result: { message: "dang nhap thanh cong", tenDangNhap, email },
      token,
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  } finally {
    connection.release();
  }
};

const registerUSerModel = async (tenDangNhap, password, email, role, SDT) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const checkEmailQuery = `SELECT * FROM taikhoan WHERE email = ?`;
    const [existingEmailRows] = await connection.execute(checkEmailQuery, [
      email,
    ]);

    if (existingEmailRows.length > 0) {
      await connection.rollback();
      return {
        result: {
          success: false,
          error: "Email đã được sử dụng.",
        },
      };
    }

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
    const token = await createToken(role, taiKhoan_id);
    return {
      result: {
        taiKhoan_id,
        role,
        tenDangNhap,
        email,
        success: true
      },
      token,
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  } finally {
    connection.release();
  }
};

const loginAdminModel = async (tenDangNhap, password, email) => {
  const selectAdmin = `select matKhau, vaiTro_id, taiKhoan_id from taikhoan where tenDangNhap = ? and email = ?`;
  const [adminIf] = await pool.execute(selectAdmin, [tenDangNhap, email]);

  const { taiKhoan_id, matKhau } = adminIf[0];
 
  if (adminIf.length === 0 || adminIf[0]?.vaiTro_id !== 2) {
    return { result: { success: false, err: "sai tai khoan" } };
  }
  const isPassword = await bcrypt.compare(password, matKhau);
  if (!isPassword) return { result: { err: "mat khau sai", success: false } };
  
  const token = await createToken("nguoi_quan_ly", taiKhoan_id);
  
  return {
    result: {
      success: true,
      message: "dang nhap thanh cong",
      TTUser: { tenDangNhap, email, taiKhoan_id },
    },
    token,
  };
};

const acceptInstructorModel = async (taiKhoan_id) => {
  const update = `update taikhoan set vaiTro_id = 3 where taiKhoan_id = ?`;
  await pool.execute(update, [taiKhoan_id]);
  return {
    result: {
      success: true,
      message: "da phe duyet tai khoan lam giang vien",
    },
  };
};

export {
  loginUserModel,
  registerUSerModel,
  loginAdminModel,
  acceptInstructorModel,
};
