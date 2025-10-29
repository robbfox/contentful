// gatsby-browser.js
import React, { useEffect, useState } from "react";

const AuthGate = ({ element }) => {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;
    const isLoginPage = path.includes("/login");
    const authed = sessionStorage.getItem("site-auth") === "1";

    if (!authed && !isLoginPage) {
      window.location.replace("/login");
    } else {
      setAuthorized(true);
    }
    setChecked(true);
  }, []);

  // only render once we've checked auth (prevents white flash)
  if (!checked) return null;

  return authorized || window.location.pathname.includes("/login")
    ? element
    : null;
};

export const wrapPageElement = ({ element, props }) => {
  return <AuthGate element={element} {...props} />;
};
