import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./SignInUp.css";

const SignInUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [SDT, setSDT] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { URL } = useContext(StoreContext);
  const navigate = useNavigate();

  const checkValidation = () => {
    if (!email.trim()) {
      setError("Email không được để trống");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (!password.trim()) {
      setError("Mật khẩu không được để trống");
      return false;
    }

    if (password.length < 5) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (!isLogin) {
      if (!username.trim()) {
        setError("Tên đăng nhập không được để trống");
        return false;
      }

      if (!SDT.trim()) {
        setError("Số điện thoại không được để trống");
        return false;
      }

      const phoneRegex = /^(0[0-9]{9})$/;
      if (!phoneRegex.test(SDT)) {
        setError(
          "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)"
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!checkValidation()) return;

    setLoading(true);
    const endpoint = isLogin ? "/api/user/loginUser" : "/api/user/registerUser";

    try {
      const payload = isLogin
        ? { email, password }
        : { username, email, password, SDT };

      const response = await fetch(`${URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.result?.success === false) {
        setError(data?.result?.err || "Có lỗi xảy ra");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.result.user_id);
        localStorage.setItem("role", data.result.role);

        alert(`${isLogin ? "Đăng nhập" : "Đăng ký"} thành công!`);
        navigate("/home");
        window.location.reload();
      }

      // reset form
      setUsername("");
      setSDT("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-signinup">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>

        {!isLogin && (
          <>
            <div className="form-group">
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={SDT}
                onChange={(e) => setSDT(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>

        <p>
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignInUp;
