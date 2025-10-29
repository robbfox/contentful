// gatsby-browser.js
import React, { useEffect, useState } from "react";

const AuthGate = ({ element }) => {
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;
    const isLoginPage =
      path.includes("/login"); // covers /login and /en-GB/login etc.
    const authed = sessionStorage.getItem("site-auth") === "1";

    if (!authed && !isLoginPage) {
      window.location.replace("/login"); // or "/en-GB/login" if that exists
    } else {
      setAuthorized(true);
    }
  }, []);

  return authorized || (typeof window !== "undefined" &&
    window.location.pathname.includes("/login"))
    ? element
    : null;
};


export const wrapPageElement = ({ element, props }) => {
  // wrap the element with our AuthGate component
  return <AuthGate element={element} {...props} />;
};