import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET, DELETE } from "../../apicontroller/ApiController";
import {
  InputGroup,
  FormControl,
  Form,
  Card,
  Row,
  Col,
  Table,
  Button,
  Breadcrumb,
  Modal,
  Spinner
} from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";

import AddressPicker from "../../Components/addressPicker";

import Swal from "sweetalert2";

const Deals = () => {

  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    lat: "",
    lang: "",
    description: "",
    consultation: "",
    deal_image: null,
  });

  const [deals, setDeals] = useState([]);

  const [hoveredDeal, setHoveredDeal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setIsUploading(true); 
      // Create a FormData object for the image
      const imageFormData = new FormData();
      imageFormData.append("file", file);


      try {
        // Send the image to the backend
        const response = await POST("utils/upload-single-file", imageFormData);

        // Check if the response contains the file URL
        if (response && response?.data?.image) {
          // Update the form data with the received image URL
          setFormData((prevData) => ({
            ...prevData,
            deal_image: response?.data?.image, // Store the Cloudinary URL
          }));

          Swal.fire({
            icon: "success",
            title: "Image uploaded successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          throw new Error("Image URL not received from the server");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload image. Please try again.",
        });
      }finally {
        setIsUploading(false); // Hide the loader
      }
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    // Use the formData state that contains both name and category_image
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        lat: formData.lat,
        lang: formData.lang,
        description: formData.description,
        consultation: formData.consultation,
        deal_image: formData.deal_image,
      };

      const res = await POST("deal/add-deal", payload);
      if (!res.error) {
        toast("Added Done");
        fetchData();
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //   const submit = async (event) => {
  //     event.preventDefault();

  //     if (!nameRef.current.value) {
  //       toast.error(" link field is required.", {
  //         className: "custom-toast-container",
  //         bodyClassName: "custom-toast-message",
  //       });
  //       return; // Prevent form submission
  //     }

  //     const formData = new FormData();
  //     formData.append("name", nameRef.current.value);
  //     formData.append("type", typeRef.current.value);
  //     formData.append("location", locationRef.current.value);
  //     formData.append("description", descriptionRef.current.value);
  //     formData.append("consultation", consultationRef.current.value);

  //     if (image) {
  //       formData.append("deal_image", image);
  //     }

  //     try {
  //       const res = await POST("deal/add-deal", formData);
  //       if (!res.error) {
  //         toast("Added Done");

  //         fetchData();
  //       } else {
  //         toast.error(res.sqlMessage);
  //       }
  //     } catch (error) {
  //       console.error("Error adding category:", error);
  //       toast.error("Failed to add category. Please try again.");
  //     }
  //   };

  const handlePlaceSelected = (place) => {
    if (place) {
      // Set the formatted address in the input field
      const formattedAddress = place.formatted_address || place.name || "";

      // Update form data with address, latitude, and longitude
      setFormData((prevData) => ({
        ...prevData,
        address: formattedAddress,
        lat: place.geometry?.location
          ? place.geometry.location.lat().toString()
          : "",
        lang: place.geometry?.location
          ? place.geometry.location.lng().toString()
          : "",
      }));

      // Optional: Log for debugging
      console.log("Selected Place:", {
        address: formattedAddress,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      });
    }
  };

  const fetchData = async () => {
    GET("deal/get-deals").then((result) => {
      setDeals(result);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (deal) => {
    setSelectedDeal(deal);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await DELETE(`deal/delete-deal/${selectedDeal._id}`, "");
      if (!res.error) {
        toast("Deleted Done");
        fetchData();
        setShowDeleteModal(false);
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal. Please try again.");
    }
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
          <Breadcrumb.Item active> Deals </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={4}>
          <Card className="mt-3">
            <Card.Body>
              <Form>
                <div className="row">
                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Deal Name </Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        value={formData.name}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Deal Type </Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="text"
                        name="type"
                        onChange={handleInputChange}
                        value={formData.type}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url">
                      {" "}
                      Search Address{" "}
                    </Form.Label>
                    <AddressPicker onPlaceSelected={handlePlaceSelected} />
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Address </Form.Label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Enter Address"
                      className="input-field"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Latitude </Form.Label>
                    <input
                      type="text"
                      name="latitude"
                      id="latitude"
                      placeholder="Latitude"
                      className="input-field"
                      value={formData.lat}
                      onChange={(e) =>
                        setFormData({ ...formData, lat: e.target.value })
                      }
                      required
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Langitude </Form.Label>
                    <input
                      type="text"
                      name="longitude"
                      id="longitude"
                      placeholder="Longitude"
                      className="input-field"
                      value={formData.lang}
                      onChange={(e) =>
                        setFormData({ ...formData, lang: e.target.value })
                      }
                      required
                    />
                  </Col>

                  <Col className="mt-2" md={12}>
                    <Form.Label htmlFor="basic-url">
                      Deal Description
                    </Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        as="textarea"
                        name="description"
                        onChange={handleInputChange}
                        value={formData.description}
                      />
                    </InputGroup>
                  </Col>

                  <Col className="mt-2" md={12}>
                    <Form.Label htmlFor="basic-url">
                      {" "}
                      Deal Consultation{" "}
                    </Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="text"
                        name="consultation"
                        onChange={handleInputChange}
                        value={formData.consultation}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Deal Image </Form.Label>
                    <InputGroup className="mb-3">
                      <FormControl
                        type="file"
                        onChange={handleImageChange}
                        disabled={isUploading} // Disable during upload
                      />
                    </InputGroup>
                    {isUploading && (
                      <div className="text-center">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Uploading...</span>
                        </Spinner>
                      </div>
                    )}
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="submit">
                      <Button
                        onClick={submit}
                        variant="primary"
                        type="submit"
                        size="lg"
                        block
                        disabled={isUploading} // Disable during upload
                      >
                        Submit
                      </Button>
                    </Form.Group>
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
                    <th> Name </th>
                    <th> Address </th>
                    <th> Latitude </th>
                    <th> Langitude </th>
                    <th> Image </th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr
                      key={deal._id}
                      onMouseEnter={() => setHoveredDeal(deal._id)}
                      onMouseLeave={() => setHoveredDeal(null)}
                    >
                      <td>{deal.name}</td>
                      <td>{deal.address}</td>
                      <td>{deal.lat}</td>
                      <td>{deal.lang}</td>
                      <td>
                        <div className="image-container">
                          <img
                            src={`${deal.deal_image}`}
                            style={{ width: "50px", height: "50px" }}
                          />
                          {hoveredDeal === deal._id && (
                            <MdDeleteForever
                              style={{ fontSize: "25px" }}
                              className="delete-icon ml-4"
                              onClick={() => handleDelete(deal)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Deal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Deal?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Deals;
