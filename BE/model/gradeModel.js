import { pool } from "../config/database.js";

const addGradeModel = async (tenCapHoc) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const addEL = `insert into caphoc(tenCapHoc) values(?)`;
    const [EL] = await connection.execute(addEL, [tenCapHoc]);

    if (EL.affectedRows === 0) {
      connection.commit();
      return {
        result: {
            success : false,
            message : "them that bai"
        }
      }
    }
    const EL_id = EL.insertId;
    const selectEL = `select * from caphoc where capHoc_id = ?`;
    const [ifEL] = await connection.execute(selectEL, [EL_id]);

    connection.commit();
    return {
      result: {
        success: true,
        message: "them cap hoc thanh cong",
        ifEL: ifEL[0],
      },
    };
  } catch (error) {
    console.log(error);
    connection.rollback();
  } finally {
    connection.release();
  }
};

const hideGradeModel = async (capHoc_id) => {
  const hideGrade = `update caphoc set is_active = 0 where capHoc_id = ?`;

  const [hide_grade] = await pool.execute(hideGrade, [capHoc_id]);

  return {
    result :{
      hide_grade : hide_grade.affectedRows
    }
  }
}

const deleteGradeModel = async (capHoc_id) => {
  const deleteGrade = `delete from caphoc where capHoc_id = ?`;
  await pool.execute(deleteGrade, [capHoc_id]);
  return {
    message : "xoa cap hoc thanh cong"
  }
}

const getGradeModel = async () => {
  const getGrade = `select * from caphoc`;
  const [grade] = await pool.execute(getGrade);
  return {
    result : {
      message : "lay danh sach cap hoc thanh cong",
      grade : grade
    }
  }
}

export {addGradeModel, hideGradeModel, deleteGradeModel, getGradeModel}