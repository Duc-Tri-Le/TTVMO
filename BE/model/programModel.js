import { pool } from "../config/database.js";

const addProgramModel = async (ten_CTH, capHoc_id, ngayTao) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const addProgram = `insert into chuongtrinhhoc(ten_CTH, capHoc_id, ngayTao) values(?,?,?)`;
    const [result] = await connection.execute(addProgram, [
      ten_CTH,
      capHoc_id,
      ngayTao,
    ]);
    if (result.affectedRows === 0)
      return {
        result: {
          message: "loi them chuong trinh hoc",
        },
      };
    const CTH_id = result.insertId;
    const selectProgram = `select 
        cth.ten_CTH, cth.ngayTao, ch.tenCapHoc from chuongtrinhhoc cth 
        left join caphoc ch on ch.capHoc_id = cth.capHoc_id 
        where CTH_id = ?`;
    const [CTH] = await connection.execute(selectProgram, [CTH_id]);

    connection.commit();

    return {
      result: {
        message: "them chuong trinh hoc thanh cong",
        CTH: CTH[0],
      },
    };
  } catch (error) {
    console.log(error);
    connection.rollback;
  } finally {
    connection.release();
  }
};

const hideProgramModel = async (CTH_id) => {
  const hideProgram = `update chuongtrinhhoc set is_active = 0 where CTH_id = ?`;
  await pool.execute(hideProgram, [CTH_id]);
  return {
    message: "an san cth thanh cong",
  };
};

const deleteProgramModel = async (CTH_id) => {
    console.log(CTH_id);
  const deleteProgram = `delete from chuongtrinhhoc where CTH_id = ?`;
  await pool.execute(deleteProgram, [CTH_id]);
  return {
    message: "xoa cth thanh cong",
  };
};

const getProgramModel = async () => {
  const getProgram = `select cth.ten_CTH, cth.ngayTao, ch.tenCapHoc,ch.is_active from chuongtrinhhoc cth 
                            left join caphoc ch on ch.capHoc_id = cth.capHoc_id
                            order by ngayTao desc`;
  const [program] = await pool.execute(getProgram);
  return {
    result: program,
    message: "danh sach chuong trinh hoc",
  };
};
export {
  addProgramModel,
  hideProgramModel,
  deleteProgramModel,
  getProgramModel,
};
