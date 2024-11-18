import React from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const AuthorizHeader = () => {


    return (
        <Navbar style={{ backgroundColor: '#37475A' }}>
            <Container>
                <Navbar.Brand href="/" style={{color:'white'}}> Mosouq </Navbar.Brand>
                <Navbar.Toggle />
            </Container>
        </Navbar>
    );
};
export default AuthorizHeader;
