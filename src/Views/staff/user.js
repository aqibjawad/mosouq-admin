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

const Users = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await GET("user/get-users");
      setStaffData(response);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data");
    }
  };

  // Utility function to convert JSON to CSV
  const convertToCSV = (data) => {
    const headers = ["Name", "Email", "Number", "Role"];
    const rows = data.map((staff) => [
      staff.name,
      staff.email,
      staff.phone,
      staff.role,
    ]);

    let csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  // Function to trigger download
  const downloadCSV = () => {
    const csvContent = convertToCSV(staffData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "all_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active> Users </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={12} className="mt-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-end mb-2">
                <Button variant="primary" onClick={downloadCSV}>
                  Download CSV
                </Button>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {staffData && staffData.length > 0 ? (
                    staffData.map((staff, index) => (
                      <tr key={index}>
                        <td>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>{staff.phone}</td>
                        <td>{staff.role}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No staff data available</td>
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

export default Users;
