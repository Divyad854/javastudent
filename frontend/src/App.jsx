import React, { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);
const BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "/api";
  // Load students
  const loadStudents = () => {
    fetch(BASE + "/students/" + email)
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  // Auto login if saved
  useEffect(() => {
    if (email) {
      setPage("dashboard");
      loadStudents();
    }
  }, []);

  // Reload students on dashboard
  useEffect(() => {
    if (page === "dashboard") loadStudents();
  }, [page]);

  // Register
  const register = () => {
    fetch(BASE + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then(() => {
      alert("Registered Successfully");
      setPage("login");
    });
  };

  // Login
  const login = () => {
    fetch(BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.text())
      .then(msg => {
        if (msg === "Login Success") {
          localStorage.setItem("email", email); // save login
          setPage("dashboard");
        } else {
          alert("Invalid login");
        }
      });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("email");
    setEmail("");
    setPage("login");
  };

  // Add student
  const addStudent = () => {
    if (!studentName) return alert("Enter name");

    fetch(BASE + "/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: studentName, email })
    }).then(() => {
      setStudentName("");
      loadStudents();
    });
  };

  return (
    <div style={container}>

      <h1 style={{ color: "#4CAF50" }}>🎓 Student Manager</h1>

      {/* LOGIN */}
      {page === "login" && (
        <div style={card}>
          <h2>Login</h2>
          <input style={input} placeholder="Email"
            onChange={e => setEmail(e.target.value)} /><br/>
          <input style={input} type="password" placeholder="Password"
            onChange={e => setPassword(e.target.value)} /><br/>

          <button style={btn} onClick={login}>Login</button>

          <p style={link} onClick={() => setPage("register")}>
            Create Account
          </p>
        </div>
      )}

      {/* REGISTER */}
      {page === "register" && (
        <div style={card}>
          <h2>Register</h2>
          <input style={input} placeholder="Email"
            onChange={e => setEmail(e.target.value)} /><br/>
          <input style={input} type="password" placeholder="Password"
            onChange={e => setPassword(e.target.value)} /><br/>

          <button style={btn} onClick={register}>Register</button>

          <p style={link} onClick={() => setPage("login")}>
            Back to Login
          </p>
        </div>
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div style={card}>
          <h2>Welcome 👋</h2>
          <p style={{fontSize:"14px"}}>{email}</p>

          <input
            style={input}
            placeholder="Student Name"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
          />

          <button style={btn} onClick={addStudent}>Add Student</button>

          <ul style={{listStyle:"none", padding:0}}>
            {students.map((s, i) => (
              <li key={i} style={listItem}>{s.name}</li>
            ))}
          </ul>

          <button style={logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- STYLES ----------
const container = {
  textAlign: "center",
  padding: "40px",
  fontFamily: "Arial",
  background: "#f0f2f5",
  height: "100vh"
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  width: "320px",
  margin: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

const input = {
  width: "90%",
  padding: "10px",
  margin: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btn = {
  padding: "10px 20px",
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px"
};

const logoutBtn = {
  ...btn,
  background: "red",
  marginTop: "20px"
};

const listItem = {
  background: "#e8f5e9",
  margin: "8px",
  padding: "10px",
  borderRadius: "6px"
};

const link = {
  color: "#007bff",
  cursor: "pointer",
  marginTop: "10px"
};