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
    <main style={{maxWidth:400, margin:"5rem auto", textAlign:"center"}}>
      <h1>Site Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{width:"100%", padding:"8px", marginBottom:"8px"}}
        />
        <button type="submit" style={{width:"100%", padding:"8px"}}>Log in</button>
      </form>
      {err && <p style={{color:"red"}}>{err}</p>}
    </main>
  );
};

export default LoginPage;
