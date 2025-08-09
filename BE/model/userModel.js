import { pool } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = async (role, taiKhoan_id) => {
  const token = jwt.sign({ taiKhoan_id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const loginUserModel = async (password, email) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectUSer = `select taiKhoan_id, matKhau, vaiTro_id, tenDangNhap from taikhoan where email = ?`;
    const [userIf] = await connection.execute(selectUSer, [email]);
    if (userIf.length === 0) {
      return { result: { err: "sai thong tin dang nhap", success: false } };
    }

    const isPassword = await bcrypt.compare(password, userIf[0].matKhau);
    if (!isPassword)
      return { result: { error: "mat khau sai", success: false } };

    const getTenVaiTro = `select tenVaiTro from vaitro where vaiTro_id = ?`;
    const [tenVaiTro] = await connection.execute(getTenVaiTro, [
      userIf[0].vaiTro_id,
    ]);

    const token = await createToken(
      tenVaiTro[0].tenVaiTro,
      userIf[0].taiKhoan_id
    );

    return {
      result: {
        message: "dang nhap thanh cong",
        username: userIf[0].tenDangNhap,
        email,
        success: true,
        user_id: userIf[0].taiKhoan_id,
        role : tenVaiTro[0].tenVaiTro,
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

const registerUSerModel = async (username, password, email, role, SDT) => {
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
    const [vaiTro] = await connection.execute(getVaiTro_id, [role]);
    const vaiTro_id = vaiTro[0].vaiTro_id;

    const insertUser = `insert into taikhoan(tenDangNhap, matKhau, email, SDT, vaiTro_id) values(?,?,?,?, ?)`;
    const [rows] = await connection.execute(insertUser, [
      username,
      hashPassword,
      email,
      SDT,
      vaiTro_id,
    ]);

    const taiKhoan_id = rows.insertId;
    const token = await createToken(role, taiKhoan_id);
    connection.commit();
    return {
      result: {
        user_id: taiKhoan_id,
        role,
        username,
        email,
        success: true,
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

const loginAdminModel = async (username, password, email) => {
  const selectAdmin = `select matKhau, vaiTro_id, taiKhoan_id from taikhoan where tenDangNhap = ? and email = ?`;
  const [adminIf] = await pool.execute(selectAdmin, [username, email]);
  console.log(adminIf);
  if (adminIf.length === 0 || adminIf[0]?.vaiTro_id !== 2) {
    return { result: { success: false, err: "sai tai khoan" } };
  }
  const { taiKhoan_id, matKhau } = adminIf[0];

  const isPassword = await bcrypt.compare(password, matKhau);
  if (!isPassword) return { result: { err: "mat khau sai", success: false } };

  const token = await createToken("nguoi_quan_ly", taiKhoan_id);

  return {
    result: {
      success: true,
      message: "dang nhap thanh cong",
      username,
      email,
      user_id: taiKhoan_id,
    },
    token,
  };
};

const acceptInstructorModel = async (taiKhoan_id, action) => {
  let result = {};
  if (action === "accept") {
    const update = `update taikhoan set vaiTro_id = 3, status = "accepted" where taiKhoan_id = ?`;
    await pool.execute(update, [taiKhoan_id]);
    result = {
      success: true,
      message: "da phe duyet tai khoan lam giang vien",
    };
  } else {
    const update = `update taikhoan set status = "", vaiTro_id = 1 where taiKhoan_id = ?`;
    await pool.execute(update, [taiKhoan_id]);
    result = {
      success: false,
      message: "ko phe duyet lam giang vien",
    };
  }
  return {
    result,
  };
};

const getStudentModel = async () => {
  const getUser = `select * from taikhoan where vaiTro_id = 1`;
  const [rows] = await pool.execute(getUser);
  const result = rows.map(({ matKhau, ...rest }) => rest);
  return {
    result: {
      message: "danh sach hoc vien",
      listStudent: result,
    },
  };
};

const getInstructorModel = async () => {
  const getInstructor = `select * from taikhoan where vaiTro_id = 3`;
  const [rows] = await pool.execute(getInstructor);

  const User = `select * from taikhoan where vaiTro_id = 1 and status = 'waiting for'`;
  const [rows2] = await pool.execute(User);

  const list = [...rows, ...rows2];
  const result = list.map(({ matKhau, ...rest }) => rest);

  return {
    result,
  };
};
const getDetailUserModel = async (taiKhoan_id) => {
  const getDetail = `select * from taikhoan where taiKhoan_id = ?`;
  const [rows] = await pool.execute(getDetail, [taiKhoan_id]);

  return {
    result: {
      success: true,
      User: rows[0],
    },
  };
};

const updateUSerModel = async ({ taiKhoan_id, ...ifUser }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const fields = [];
    const values = [];

    for (const key in ifUser) {
      if (ifUser[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(ifUser[key]);
      }
    }
    values.push(taiKhoan_id);
    console.log({ fields, values });
    const updateUser = `update taikhoan set ${fields.join(
      ", "
    )} where taiKhoan_id = ?`;
    const [update] = await connection.execute(updateUser, values);

    const getUser = `select * from taikhoan where taiKhoan_id = ?`;
    const [user] = await connection.execute(getUser, [taiKhoan_id]);
    connection.commit();
    return {
      result: {
        user: user[0],
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  } finally {
    connection.release();
  }
};

const deleteUserModel = async (taiKhoan_id) => {
  const deleteUser = `delete from taikhoan where taiKhoan_id = ?`;
  await pool.execute(deleteUser, [taiKhoan_id]);
  return {
    result: {
      message: "da xoa tai khoan",
    },
  };
};

const lockUserModel = async (taiKhoan_id, action) => {
  let status = "";
  let result = {};
  if (action === "lock") {
    status = "locked";
    result = {
      message: "da khoa tai khoan",
    };
  } else {
    result = {
      message: "da mo khoa tai khoan",
    };
  }
  const lockUser = `update taikhoan set status = ? where taiKhoan_id = ?`;
  await pool.execute(lockUser, [status, taiKhoan_id]);
  return {
    result,
  };
};

export {
  loginUserModel,
  registerUSerModel,
  loginAdminModel,
  acceptInstructorModel,
  getStudentModel,
  getDetailUserModel,
  updateUSerModel,
  getInstructorModel,
  deleteUserModel,
  lockUserModel,
};
