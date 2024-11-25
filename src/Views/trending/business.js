import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container } from "react-bootstrap";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GET, DELETE } from "../../apicontroller/ApiController";

const BusinessShow = () => {
  const [business, setBusiness] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    GET("business-profile/getAll").then((result) => {
      setBusiness(result.businessProfiles);
    });
  }, []);

  const handleDeleteConfirm = (businessId) => {
    setShowDeleteModal(true);
    setSelectedBusiness(businessId);
  };

  const handleDelete = () => {
    DELETE(`business-profile/delete/${selectedBusiness}`).then((response) => {
      if (response.success) {
        setBusiness(business.filter((item) => item.id !== selectedBusiness));
        setShowDeleteModal(false);
      }
    });
  };

  const handleView = (business) => {
    setSelectedBusiness(business);
    setShowViewModal(true);
  };

  const filteredBusiness = business.filter((item) =>
    item.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="mt-4">
      {/* Search Bar */}
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by business name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-100"
        />
      </div>

      {/* Business Table */}
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Business Name</th>
            <th>Opening Hours</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBusiness.map((business, index) => (
            <tr key={index}>
              <td style={{ width: "100px" }}>
                <img
                  src={business.logo || "https://placehold.co/700x600"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/700x600";
                  }}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                  alt="Business Logo"
                />
              </td>
              <td>{business.businessName}</td>
              <td>{`${business.fromTime} - ${business.toTime}`}</td>
              <td>{business.address}</td>
              <td>{business.email}</td>
              <td>{business.phone}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDeleteConfirm(business.id)}
                >
                  <FaTrash />
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleView(business)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => console.log("Edit functionality here")}
                >
                  <FaEdit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Business Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBusiness && (
            <div>
              <div className="text-center mb-4">
                <img
                  src={selectedBusiness.logo || "https://placehold.co/700x600"}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                  }}
                  alt="Business Logo"
                />
              </div>

              <h4>{selectedBusiness.businessName}</h4>
              <p className="mt-3">
                <strong>Description:</strong> {selectedBusiness.description}
              </p>

              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Website:</strong>{" "}
                    <Link to={selectedBusiness.website}>Website</Link>
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    <Link to={selectedBusiness.location}>Location</Link>
                  </p>
                </div>
              </div>

              {selectedBusiness.images &&
                selectedBusiness.images.length > 0 && (
                  <div className="mt-4">
                    <h5>Business Images</h5>
                    <div className="row">
                      {selectedBusiness.images.map((image, index) => (
                        <div key={index} className="col-md-3 mb-3">
                          <img
                            src={image}
                            alt={`Business ${index + 1}`}
                            className="img-fluid rounded"
                            style={{ height: "120px", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this business?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BusinessShow;
