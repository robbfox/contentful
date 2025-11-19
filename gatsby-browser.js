import React from "react";

// Optional safeguard (prevents Gatsby from pre-rendering visible head HTML)
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  replaceHeadComponents(getHeadComponents());
};

