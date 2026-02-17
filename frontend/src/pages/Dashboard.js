<<<<<<< HEAD
function Dashboard() {
  return (
    <div>
      <h2>Student Dashboard</h2>
=======
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/api/test", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMessage(res.data.message))
    .catch(err => setMessage("Not authorized"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Dashboard</h2>
      <p>{message}</p>
>>>>>>> 223c3097b59af1014742816d14412459207b57e0
    </div>
  );
}

export default Dashboard;
