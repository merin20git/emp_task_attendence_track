import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [status, setStatus] = useState("loading...");
  const [tasks, setTasks] = useState([]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Load Attendance Status
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/attendance/${userId}`)
      .then((res) => {
        if (res.data.data.length > 0) {
          const latest = res.data.data[0];
          setStatus(latest.status);
        } else {
          setStatus("Not Checked In");
        }
      })
      .catch(() => setStatus("Error loading"));
  }, []);

  // Load Assigned Tasks
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/tasks/user/${userId}`)
      .then((res) => setTasks(res.data.data || []))
      .catch((err) => console.log(err));
  }, []);

  // Check In
  const handleCheckIn = () => {
    axios
      .post(`${API_BASE_URL}/checkin`, { userId })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  // Check Out
  const handleCheckOut = () => {
    axios
      .post(`${API_BASE_URL}/checkout`, { userId })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between">
        <h1>Employee Dashboard</h1>
        <button className="btn btn-dark" onClick={logout}>
          Logout
        </button>
      </div>

      <h3>Attendance Status: {status}</h3>

      <button className="btn btn-success me-3" onClick={handleCheckIn}>
        Check In
      </button>

      <button className="btn btn-danger" onClick={handleCheckOut}>
        Check Out
      </button>

      <hr />

      <button className="btn btn-info" onClick={() => navigate("/tasks")}>
        Manage Tasks
      </button>

      <h3 className="mt-4">Your Assigned Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks assigned</p>
      ) : (
        tasks.map((t) => (
          <div key={t._id} className="p-2 border mb-2 rounded">
            <b>{t.title}</b>
            <p>{t.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeDashboard;
