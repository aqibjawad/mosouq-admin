import React, { useState, useRef, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
  Breadcrumb,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { POST, GET } from "../../apicontroller/ApiController";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [staffData, setStaffData] = useState([]);
  const [errors, setErrors] = useState({});
  const nameRef = useRef();

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await GET("staff/get-staff");
      setStaffData(response);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await POST("staff/add-staff", formData);
      if (!res.error) {
        toast.success("Staff member added successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
        });
        fetchStaffData(); // Refresh staff list
      } else {
        toast.error(res.error || "Failed to add staff member");
      }
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast.error("An error occurred while adding staff member");
    }
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>Add Staff</Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={4}>
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={submit}>
                <div className="row">
                  {["name", "email", "phone", "password"].map((field) => (
                    <Col md={12} key={field}>
                      <Form.Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <FormControl
                          type={field === "password" ? "password" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          ref={field === "name" ? nameRef : null}
                          isInvalid={!!errors[field]}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[field]}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  ))}

                  <Col md={12}>
                    <Button variant="primary" type="submit" size="lg" block>
                      Submit
                    </Button>
                  </Col>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={8} className="mt-3">
          <div className="card">
            <div className="card-body">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody>
                  {staffData && staffData.length > 0 ? (
                    staffData.map((staff, index) => (
                      <tr key={index}>
                        <td>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>{staff.phone}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No staff data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default AddStaff;
