import React from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const CheckInOut = () => {
  const userId = localStorage.getItem("userId");

  const checkIn = () =>
    axios
      .post(`${API_BASE_URL}/checkin`, { userId })
      .then(() => alert("Checked In"))
      .catch((err) => console.log(err));

  const checkOut = () =>
    axios
      .post(`${API_BASE_URL}/checkout`, { userId })
      .then(() => alert("Checked Out"))
      .catch((err) => console.log(err));

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
