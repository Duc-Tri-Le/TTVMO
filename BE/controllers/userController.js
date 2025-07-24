import { acceptInstructorModel, loginAdminModel, loginUserModel, registerUSerModel } from "../model/userModel.js";

const loginUserController = async (req, res) =>{
    try {
        const {tenDangNhap, password, email}= req.body;
        const {result, token} = await loginUserModel(tenDangNhap, password, email);
        return res.json({result, token})
    } catch (error) {
        console.log(error);
    }
}

const registerUSer = async (req, res) => {
    const {tenDangNhap, email, password, SDT} = req.body;
    const role = "hoc_vien";
    const {result, token} = await registerUSerModel(tenDangNhap, password, email, role, SDT);
    return res.json({result, token})
}

const loginAdmin = async (req, res) => {
    try {
        const {tenDangNhap, password, email}= req.body;
        const {result, token} = await loginAdminModel(tenDangNhap, password, email);
        return res.json({result, token})
    } catch (error) {
        console.log(error);
    }
}

const acceptInstructor = async (req, res) => {
    try {
        const {taiKhoan_id} = req.body;
        const {result} = await acceptInstructorModel(taiKhoan_id);
        return res.json({
            result
        })
    } catch (error) {
        
    }
}

export {loginUserController, registerUSer, loginAdmin,acceptInstructor}