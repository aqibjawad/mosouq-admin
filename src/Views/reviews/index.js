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
  Table,
  Modal,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { POST, GET } from "../../apicontroller/ApiController";

const Reviews = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await GET("reviews/getAllReviews");
      setStaffData(response);
    } catch (error) {
      console.error("Error fetching Reviews data:", error);
      toast.error("Failed to fetch Reviews data");
    }
  };

  const handleApprove = async (id, currentStatus) => {
    setLoading(true); // Start loading
    try {
      const newStatus = !currentStatus; // Toggle the status
      const payload = {
        id: id,
        approved: newStatus,
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleShowDescription = (description) => {
    setModalDescription(description);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDescription("");
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
                    <th>Business Email</th>
                    <th>Business Company</th>
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
                        <td>{staff?.businessId?.name || "null"}</td>
                        <td>{staff?.businessId?.email || "null"}</td>
                        <td>{staff?.businessId?.company || "null"}</td>
                        <td>{staff.userId.name}</td>
                        <td>{staff.userId.email}</td>
                        <td>{staff.rating}</td>
                        <td>{staff.title}</td>
                        <td
                          onClick={() =>
                            handleShowDescription(staff.description)
                          }
                        >
                          {staff.description.slice(0, 40)}...
                        </td>
                        <td>{staff.approved ? "Approved" : "Not Approved"}</td>
                        <td>
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <Button
                              variant={staff.approved ? "danger" : "success"}
                              onClick={() =>
                                handleApprove(staff._id, staff.approved)
                              }
                            >
                              {staff.approved ? "Disapprove" : "Approve"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">No reviews data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>

      {/* Modal for viewing description */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Review Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reviews;
