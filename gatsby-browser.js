import React, { useEffect, useState } from "react";

const AuthGate = ({ element }) => {
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    const isLogin = path.includes("/login");
    const authed = sessionStorage.getItem("site-auth") === "1";

    if (!authed && !isLogin) {
      window.location.replace("/login");
    } else {
      setAuthorized(true);
      setReady(true);
    }
  }, []);

  if (!ready) return null;
  return authorized || window.location.pathname.includes("/login")
    ? element
    : null;
};

export const wrapPageElement = ({ element, props }) => {
  return <AuthGate element={element} {...props} />;
};

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  replaceHeadComponents(getHeadComponents());
};
