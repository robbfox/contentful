// src/pages/login.js
import React, { useState } from "react";
import { navigate } from "gatsby";

const LoginPage = () => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const secret = process.env.GATSBY_SITE_PASSWORD || "";
    if (pw === secret) {
      sessionStorage.setItem("site-auth", "1");
        navigate("/");
    } else {
      setErr("Wrong password");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "1rem",
          padding: "2rem 3rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>🔒 Site Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{
              width: "95%%",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              marginBottom: "1rem",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              background: "#fff",
              color: "#333",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#f5f5f5")}
            onMouseOut={(e) => (e.target.style.background = "#fff")}
          >
            Log in
          </button>
        </form>
        {err && <p style={{ color: "#ffbaba", marginTop: "1rem" }}>{err}</p>}
      </div>
    </main>
  );
};

export default LoginPage;
