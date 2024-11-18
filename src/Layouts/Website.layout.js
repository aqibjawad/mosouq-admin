import React from "react";

import Header from "../Components/Header";
import SideBar from "../Components/Sidebar/index";

import "./index.css";

const WebsiteLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />

      <div className="d-flex">
        {window.innerWidth > 480 ? <SideBar /> : ""}

        <div className="main-body">{children}</div>
      </div>

      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default WebsiteLayout;
