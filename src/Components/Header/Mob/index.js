import React from "react";

import Container from 'react-bootstrap/Container';
import {Navbar, Col} from 'react-bootstrap';

import MobSide from "../../Sidebar/Mob";

const MobHead = () => {
    return (
        <Navbar style={{ backgroundColor: '#37475A', height:'2.8rem' }}>
            <Container>
                <Col style={{color:'white'}}>
                    Mosouq
                </Col>
                <Navbar.Brand style={{ color: 'white' }}> 
                    <MobSide />
                </Navbar.Brand>
                <Navbar.Toggle />
            </Container>
        </Navbar>
    )
}

export default MobHead