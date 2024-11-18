import React, { useState, useEffect } from "react";
import { GET, DELETE } from "../../apicontroller/ApiController"; // Assuming you have these methods in your ApiController
import { Row, Col, Button, Modal } from "react-bootstrap";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";

import { Link } from "react-router-dom";

const BusinessShow = () => {
  const [business, setBusiness] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null); // To store selected business for modals

  // Fetch business profiles on component mount
  useEffect(() => {
    GET("business-profile/getAll").then((result) => {
      setBusiness(result.businessProfiles);
    });
  }, []);

  // Function to handle delete confirmation
  const handleDeleteConfirm = (businessId) => {
    setShowDeleteModal(true); // Open delete confirmation modal
    setSelectedBusiness(businessId); // Set the selected business to delete
  };

  // Function to delete business after confirmation
  const handleDelete = () => {
    DELETE(`business-profile/delete/${selectedBusiness}`).then((response) => {
      if (response.success) {
        setBusiness(business.filter((item) => item.id !== selectedBusiness)); // Update UI
        setShowDeleteModal(false); // Close modal
      }
    });
  };

  // Function to handle view action (open view modal)
  const handleView = (business) => {
    setSelectedBusiness(business); // Set the business to view
    setShowViewModal(true); // Open the view modal
  };

  // Close modals
  const handleCloseViewModal = () => setShowViewModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <div>
      <Row className="justify-content-center mt-4 cat-container">
        {business.map((businesses, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="shadow-sm rounded-2 p-2 business_card">
              <Row>
                {/* Image on the left */}
                <Col xs={4}>
                  <img
                    src={
                      businesses.logo
                        ? businesses.logo
                        : "https://placehold.co/700x600"
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/700x600";
                    }}
                    style={{
                      objectFit: "contain",
                      width: "100%", // Full width of the column
                      borderRadius: "6px",
                      height: "100px",
                    }}
                    alt="Banner"
                  />
                </Col>

                {/* Business name and buttons on the right */}
                <Col
                  xs={8}
                  className="d-flex flex-column justify-content-center"
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {businesses.businessName}
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="outline-danger"
                      className="me-2"
                      onClick={() => handleDeleteConfirm(businesses.id)}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleView(businesses)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => console.log("Edit functionality here")}
                    >
                      <FaEdit />
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        ))}
      </Row>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Business Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBusiness && (
            <div>
              <p>
                <strong>Address:</strong> {selectedBusiness.address}
              </p>
              <p>
                <strong>Description:</strong> {selectedBusiness.description}
              </p>

              <Row>
                <Col lg={7}>
                  <p>
                    <strong>Email:</strong> {selectedBusiness.email}
                  </p>
                </Col>

                <Col lg={5}>
                  <p>
                    <strong>Phone:</strong> {selectedBusiness.phone}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <p>
                    <strong>Opening Time:</strong> {selectedBusiness.toTime}
                  </p>
                </Col>

                <Col>
                  <p>
                    <strong>Closing Time:</strong> {selectedBusiness.fromTime}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <p>
                    <strong>Website:</strong>{" "}
                    <Link href={selectedBusiness.website}> Website </Link>
                  </p>
                </Col>

                <Col>
                  <p>
                    <strong>Location:</strong>
                    <Link href={selectedBusiness.location}> Location </Link>
                  </p>
                </Col>
              </Row>

              <Row className="mt-3">
                {selectedBusiness.images &&
                selectedBusiness.images.length > 0 ? (
                  <Row className="mt-3">
                    {selectedBusiness.images.map((image, index) => (
                      <Col key={index} xs={3} className="mb-2">
                        <img
                          src={image}
                          alt={`business-pic-${index}`}
                          className="img-fluid"
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>No images available for this business.</p>
                )}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this business?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BusinessShow;
