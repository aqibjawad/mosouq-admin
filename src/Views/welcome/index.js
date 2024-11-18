import React from "react";
import "./index.css";

import {Link} from "react-router-dom"

const WelcomePage = () => {
  return (
    <div className="center-container">
        
      <div className="welcome">Welcome !</div>
      <div className="welcome-tag"> To the Mosouq Admin </div>

      <div className="login-button">
        <Link style={{color:"white", textDecoration:"none"}} to="/sign-in">
            Log in
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
