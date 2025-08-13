import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./SignInUp.css"

const SignInUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [SDT, setSDT] = useState("");
  const { URL } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/user/loginUSer" : "/api/user/registerUser";

    try {
      const payload = isLogin
        ? { email, password }
        : { username, email, password, SDT };

      const response = await fetch(`${URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (data?.result.success === false) {
        alert(data?.result.err);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.result.user_id);
        localStorage.setItem("role", data.result.role)
        navigate("/home");
        alert(`${isLogin ? "Đăng nhập" : "Đăng ký"} thành công!`);
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setSDT("")
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
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={SDT}
                onChange={(e) => setSDT(e.target.value)}
                required
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
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignInUp;
