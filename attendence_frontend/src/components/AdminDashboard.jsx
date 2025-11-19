import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    userId: ""
  });

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Load users
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/users`)
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // Load attendance
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/attendance`)
      .then((res) => setAttendance(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // Inputs
  const inputHandler = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // Create Task
  const createTask = () => {
    axios
      .post(`${API_BASE_URL}/createTask`, task)
      .then(() => {
        alert("Task Created!");
        setTask({ title: "", description: "", userId: "" });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      {/* Logout button */}
      <button
        className="btn btn-dark"
        style={{ float: "right" }}
        onClick={logout}
      >
        Logout
      </button>

      <h2>Admin Dashboard</h2>
      <hr />

      {/* Create Task Section */}
      <h4>Create Task</h4>

      <div className="mb-3">
        <label>Task Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={task.title}
          onChange={inputHandler}
        />
      </div>

      <div className="mb-3">
        <label>Description</label>
        <textarea
          className="form-control"
          name="description"
          value={task.description}
          onChange={inputHandler}
        ></textarea>
      </div>

      <div className="mb-3">
        <label>Assign To Employee</label>
        <select
          className="form-control"
          name="userId"
          value={task.userId}
          onChange={inputHandler}
        >
          <option value="">Select Employee</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-success" onClick={createTask}>
        Assign Task
      </button>

      <hr />

      {/* Attendance Section */}
      <h4>Employee Attendance</h4>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Status</th>
            <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item) => (
            <tr key={item._id}>
              <td>{item.userId?.name}</td>
              <td>{item.userId?.email}</td>
              <td>{item.status}</td>
              <td>{new Date(item.checkInTime).toLocaleString()}</td>
              <td>
                {item.checkOutTime
                  ? new Date(item.checkOutTime).toLocaleString()
                  : "Not checked out"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
