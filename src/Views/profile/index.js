import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
  Breadcrumb,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { PUT } from '../../apicontroller/ApiController';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    // Retrieve user object from local storage
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserData({
        name: user.name,
        email: user.email,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await PUT("update-profile", { email: userData.email });
      if (!res.error) {
        toast.success("Profile updated successfully");
        // Update local storage with new email
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          user.email = userData.email;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile");
    }
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>Profile</Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={6}>
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;