import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { URL } = useContext(StoreContext);
  const navigate = useNavigate();

  const payload = { email, password, username };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "api/user/loginAdmin";
    try {
      const response = await fetch(`${URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (data.result.success === false) {
        alert(data.result.err);
      } else {
        alert("Welcome admiin");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.result.user_id);
        setEmail("");
        setPassword("");
        navigate("/instructor");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
