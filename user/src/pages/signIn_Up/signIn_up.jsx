import React from "react";
import { useState } from "react";

const signIn_up = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="container-signIn_Up">
      <form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default signIn_up;
