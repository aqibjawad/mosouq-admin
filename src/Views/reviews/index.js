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

const Reviews = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await GET("reviews/getAll");
      setStaffData(response);
    } catch (error) {
      console.error("Error fetching Reviews data:", error);
      toast.error("Failed to fetch Reviews data");
    }
  };

  const handleApprove = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus; // Toggle the status
      const payload = {
        id: id, // Send the id in the request body
        approved: newStatus, // Optionally include the new approval status if needed
      };

      await POST("reviews/approveReview", payload); // Adjust the API endpoint if necessary
      toast.success(
        `Review ${newStatus ? "approved" : "disapproved"} successfully`
      );

      // Update local state after successful API call
      setStaffData((prevData) =>
        prevData.map((staff) =>
          staff._id === id ? { ...staff, approved: newStatus } : staff
        )
      );
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Failed to update review status");
    }
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
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Business Email</th> <th>Business Company</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Rating</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staffData && staffData.length > 0 ? (
                    staffData.map((staff, index) => (
                      <tr key={index}>
                        <td>{staff?.businessId?.name ||"null"}</td>{" "}
                        <td>{staff?.businessId?.email ||"null"}</td>{" "}
                        <td>{staff?.businessId?.company ||"null"}</td>{" "}
                        <td>{staff.userId.name}</td>
                        <td>{staff.userId.email}</td>
                        <td>{staff.rating}</td>
                        <td>{staff.title}</td>
                        <td>{staff.description.slice(0, 40)}...</td>
                        <td>{staff.approved ? "Approved" : "Not Approved"}</td>
                        <td>
                          <Button
                            variant={staff.approved ? "danger" : "success"}
                            onClick={() =>
                              handleApprove(staff._id, staff.approved)
                            }
                          >
                            {staff.approved ? "Disapprove" : "Approve"}
                          </Button>
                        </td>
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

export default Reviews;
