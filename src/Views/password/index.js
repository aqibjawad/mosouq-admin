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
import axios from "axios";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    // Retrieve user object from local storage
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setEmail(user.email);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error("New password must be different from the old password");
      return;
    }

    const payload = {
      email: email,
      password: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    try {
      const result = await axios.post(
        `http://localhost:5000/api/user/update-password`,
        payload
      );
      toast.success("Password updated successfully");
      // Clear the form after successful update
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating the password");
    }
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
          <Breadcrumb.Item active> Update Password </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={4}>
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={submit}>
                <div className="row">
                  <Col md={12}>
                    <Form.Label htmlFor="oldPassword">Old Password</Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="newPassword">New Password</Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="submit">
                      <Button variant="primary" type="submit" size="lg" block>
                        Update Password
                      </Button>
                    </Form.Group>
                  </Col>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpdatePassword;