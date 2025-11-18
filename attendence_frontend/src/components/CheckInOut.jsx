import React from "react";
import axios from "axios";

const CheckInOut = () => {
  const userId = localStorage.getItem("userId");

  const checkIn = () =>
    axios.post("http://localhost:3030/checkin", { userId })
      .then(() => alert("Checked In"));

  const checkOut = () =>
    axios.post("http://localhost:3030/checkout", { userId })
      .then(() => alert("Checked Out"));

  return (
    <div className="container mt-5">
      <h2>Check In / Check Out</h2>
      <button className="btn btn-success m-2" onClick={checkIn}>
        Check In
      </button>
      <button className="btn btn-danger m-2" onClick={checkOut}>
        Check Out
      </button>
    </div>
  );
};

export default CheckInOut;
