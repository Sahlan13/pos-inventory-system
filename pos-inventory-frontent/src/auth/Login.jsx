import React, { useState } from "react";
import API from "../api";
import { saveAuth } from "./authHelpers";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      saveAuth(data);
      if (data.user.role === "admin") nav("/admin/products");
      else nav("/pos");
    } catch (err) {
      setErr(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={submit}>
        <h2>Login</h2>

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />

        <input
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Login</button>

        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
};

export default Login;
