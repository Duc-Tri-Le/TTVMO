import React, { useContext } from "react";
import ManagerUser from "../ManagerUser/ManagerUser";
import { StoreContext } from "../../../context/StoreContext";
import "./IfUser.css";

const IfUser = () => {
  const { URL, userId, ifUser: userInfo } = useContext(StoreContext);

  console.log(userInfo);

  return (
    <ManagerUser>
      <div className="ifUser-container">
        <h2>Thông tin người dùng</h2>
        <ul>
          <li><strong>Tên đăng nhập: </strong> {userInfo?.User?.tenDangNhap || '—'}</li>
          <li><strong>Tên người dùng: </strong> {userInfo?.User?.tenNguoiDung || '—'}</li>
          <li><strong>Email: </strong> {userInfo?.User?.email || '—'}</li>
          <li><strong>SDT: </strong> {userInfo?.User?.sdt || '—'}</li>
          <li><strong>Năm Sinh: </strong> {userInfo?.User?.namSinh || '—'}</li>
          <li><strong>Vai Trò: </strong> {userInfo?.User?.vaiTro_id === 1 ? "Hoc vien" : "Giang vien"}</li>
        </ul>
      </div>
    </ManagerUser>
  );
};

export default IfUser;
