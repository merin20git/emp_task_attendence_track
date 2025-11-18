import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginUser = () => {
    axios
      .post("http://localhost:3030/signIn", input)
      .then((response) => {
        console.log("Login Response:", response.data);

        if (response.data.status === "success") {
          alert("Sign In successful!");

          const user = response.data.user;

          // Save required data
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("role", user.role);

          // Redirect based on role
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/employee");
          }
        } else {
          alert("Invalid email or password");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Login failed!");
      });
  };

  return (
    <div className="container mt-5">
      <h2>Employee or Admin Sign In</h2>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={input.email}
          onChange={inputHandler}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={input.password}
          onChange={inputHandler}
        />
      </div>

      <button className="btn btn-primary w-100" onClick={loginUser}>
        Sign In
      </button>

      <button
        className="btn btn-secondary w-100 mt-2"
        onClick={() => navigate("/signup")}
      >
        Create New Account
      </button>
    </div>
  );
};

export default SignIn;
