import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskManager = () => {
  const userId = localStorage.getItem("userId");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3030/tasks/user/${userId}`)
      .then((res) => setTasks(res.data.data || []))
      .catch(err => console.log(err));
  }, []);

  const startTask = (taskId) => {
    axios.post("http://localhost:3030/task/start", { userId, taskId })
      .then(() => alert("Task Started"));
  };

  const stopTask = (taskId) => {
    axios.post("http://localhost:3030/task/stop", { userId, taskId })
      .then(() => alert("Task Stopped"));
  };

  return (
    <div className="container mt-4">
      <h3>Your Tasks</h3>

      {tasks.length === 0 && <p>No tasks assigned.</p>}

      {tasks.map((t) => (
        <div className="p-3 border rounded mb-2" key={t._id}>
          <h5>{t.title}</h5>
          <p>{t.description}</p>

          <button className="btn btn-primary me-2" onClick={() => startTask(t._id)}>
            Start
          </button>
          <button className="btn btn-warning" onClick={() => stopTask(t._id)}>
            Stop
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskManager;
