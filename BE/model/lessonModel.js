import { pool } from "../config/database.js";

const addLessonModel = async (ifLesson, ifDocument) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const fields = [];
    const values = [];
    const dauGiaTri = [];
    for (const key in ifLesson) {
      if (ifLesson[key] !== undefined) {
        fields.push(key);
        values.push(ifLesson[key]);
        dauGiaTri.push("?");
      }
    }
    const addLesson = `insert into baigiang(${fields.join(
      ", "
    )}) values(${dauGiaTri.join(", ")})`;
    await connection.execute(addLesson, values);
    
  } catch (error) {
    connection.rollback()
  }
};


export { addLessonModel };
