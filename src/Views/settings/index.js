import React from "react";
import { Card, Row, Col, Breadcrumb, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Settings = () => {
    return (
        <div>
            <Col sm={12} className="mt-3">
                <Breadcrumb>
                    <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
                    <Breadcrumb.Item active> Settings </Breadcrumb.Item>
                </Breadcrumb>
            </Col>

            <Row>
                <Col sm={4}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Nav className="flex-column">
                                <Nav.Link as={Link} to="/settings/profile">Profile</Nav.Link>
                                <Nav.Link as={Link} to="/settings/account">Account</Nav.Link>
                                <Nav.Link as={Link} to="/settings/security">Security</Nav.Link>
                                <Nav.Link as={Link} to="/settings/notifications">Notifications</Nav.Link>
                                <Nav.Link as={Link} to="/settings/billing">Billing</Nav.Link>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={8} className="mt-3">
                    <div className="card">
                        <div className="card-body">
                            {/* Content for the selected settings page will be rendered here */}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Settings;