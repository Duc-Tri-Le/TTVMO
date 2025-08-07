import {
  acceptInstructorModel,
  deleteUserModel,
  getDetailUserModel,
  getInstructorModel,
  getStudentModel,
  lockUserModel,
  loginAdminModel,
  loginUserModel,
  registerUSerModel,
  updateUSerModel,
} from "../model/userModel.js";

const loginUserController = async (req, res) => {
  try {
    const { password, email } = req.body;
    const { result, token } = await loginUserModel(password, email);
    return res.json({ result, token });
  } catch (error) {
    console.log(error);
  }
};

const registerUSer = async (req, res) => {
  const { username, email, password, SDT } = req.body;
  const role = "hoc_vien";
  const { result, token } = await registerUSerModel(
    username,
    password,
    email,
    role,
    SDT
  );
  return res.json({ result, token });
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // console.log({username, password,email});
    const { result, token } = await loginAdminModel(username, password, email);
    return res.json({ result, token });
  } catch (error) {
    console.log(error);
  }
};

const acceptInstructor = async (req, res) => {
  try {
    const { taiKhoan_id, action } = req.body;
    const { result } = await acceptInstructorModel(taiKhoan_id, action);
    return res.json({
      result,
    });
  } catch (error) {}
};

const getStudent = async (req, res) => {
  try {
    const { result } = await getStudentModel();
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const getInstructor = async (req, res) => {
  const { result } = await getInstructorModel();
  return res.json(result);
};

const getDetailUser = async (req, res) => {
  try {
    const { taiKhoan_id } = req.body;
    const { result } = await getDetailUserModel(taiKhoan_id);
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  const { ifUsers } = req.body;
  ifUsers.ngaySua = new Date();

  const { result } = await updateUSerModel(ifUsers);
  return res.json(result);
};

const deleteUser = async (req, res) => {
  const { taiKhoan_id } = req.body;
  const { result } = await deleteUserModel(taiKhoan_id);
  return res.json(result);
};

const lockUser = async (req, res) => {
  const { taiKhoan_id, action } = req.body;
  const { result } = await lockUserModel(taiKhoan_id, action);
  res.json(result);
};

export {
  loginUserController,
  registerUSer,
  loginAdmin,
  acceptInstructor,
  getStudent,
  getDetailUser,
  updateUser,
  getInstructor,
  deleteUser,
  lockUser,
};
