import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const inputHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const readValue = () => {
    const newUser = {
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
    };

    axios
      .post("http://localhost:3030/signup", newUser)
      .then((response) => {
        console.log(response.data);

        if (response.data.status === "success") {
          alert("Registered Successfully!");

          setInput({
            name: "",
            email: "",
            password: "",
            role: "",
          });

          navigate("/");
        } else {
          alert("Email already exists!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Employee Registration</h2>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={input.name}
          onChange={inputHandler}
        />
      </div>

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

      <div className="mb-3">
        <label className="form-label">Role</label>
        <select
          name="role"
          className="form-control"
          value={input.role}
          onChange={inputHandler}
        >
          <option value="">Select Role</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button onClick={readValue} className="btn btn-success w-100">
        Register
      </button>

      <button
        className="btn btn-secondary w-100 mt-2"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>
    </div>
  );
};

export default SignUp;
