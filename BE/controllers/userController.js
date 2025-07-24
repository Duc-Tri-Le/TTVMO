import validator from "validator";
import jwt from "jsonwebtoken";
import { loginUserModel, registerUSerModel } from "../model/userModel.js";

const createToken = async (role, taiKhoan_id) => {
    const token = jwt.sign({taiKhoan_id, role}, process.env.JWT_SERECT_KEY, {
        expiresIn : "2h"
    });
    return token;
}

const loginUserController = async (req, res) =>{
    try {
        const {tenDangNhap, password, email}= req.body;

        const {result} = await loginUserModel(tenDangNhap, password, email);
        const token = await createToken("hoc_vien", result.taiKhoan_id)
        return res.json({result, token})
    } catch (error) {
        console.log(error);
    }
}

const registerUSer = async (req, res) => {
    const {tenDangNhap, email, password, SDT} = req.body;
    const role = "hoc_vien";
    const {result} = await registerUSerModel(tenDangNhap, password, email, role, SDT);
    const token = await createToken(role, result.taiKhoan_id);
    return res.json({result, token})
}

const loginAdmin = async (req, res) => {
    try {
        const {tenDangNhap, password, email}= req.body;

    } catch (error) {
        
    }
}

export {loginUserController, registerUSer}