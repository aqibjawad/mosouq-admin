import React from "react";

import './index.css'

const AuthorizedLayout = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}

export default AuthorizedLayout;
