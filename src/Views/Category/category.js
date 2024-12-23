import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET, DELETE, PUT } from "../../apicontroller/ApiController";
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
} from "react-bootstrap";

import { MdDeleteForever } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";

import Swal from "sweetalert2";

const Category = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_image: "",
  });

  const [image, setImage] = useState(null);
  const nameRef = useRef();
  const [categories, setCategories] = useState([]);

  const [imagePreview, setImagePreview] = useState(
    "https://via.placeholder.com/150"
  );

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

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
            category_image: response?.data?.image, // Store the Cloudinary URL
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
      }
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    // Use the formData state that contains both name and category_image
    try {
      const payload = {
        name: formData.name,
        category_image: formData.category_image, // This will be the Cloudinary URL
      };

      const res = await POST("category/add-category", payload);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    console.log("Selected image:", file);
  };

  const fetchData = async () => {
    GET("category/get-categories").then((result) => {
      setCategories(result);
    });
  };

  const [editFormData, setEditFormData] = useState({
    name: "",
    category_image: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditFormData({
      name: category.name,
      category_image: category.category_image,
    });
    setShowEditModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await DELETE(
        `category/delete-category/${selectedCategory._id}`,
        ""
      );
      if (!res.error) {
        toast("Deleted Done");
        fetchData();
        setShowDeleteModal(false);
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const confirmEdit = async () => {
    const formData = new FormData();

    // Use .set() instead of .append() to ensure single value
    formData.set("name", nameRef.current.value);

    if (image) {
      formData.set("category_image", image);
    }

    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await PUT(
        `category/update-category/${selectedCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // ... rest of the code
    } catch (error) {
      console.error("Full error details:", error.response);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      try {
        const response = await POST("utils/upload-single-file", imageFormData);
        if (response && response?.data?.image) {
          setEditFormData((prev) => ({
            ...prev,
            category_image: response?.data?.image,
          }));
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
          <Breadcrumb.Item active> Category </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={4}>
          <Card className="mt-3">
            <Card.Body>
              <Form>
                <div className="row">
                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Category Name </Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl
                        type="text"
                        name="name" // Add this
                        onChange={handleInputChange}
                        value={formData.name}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url"> Image </Form.Label>
                    <InputGroup className="mb-3">
                      <FormControl type="file" onChange={handleImageChange} />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="submit">
                      <Button
                        onClick={submit}
                        variant="primary"
                        type="submit"
                        size="lg"
                        block
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
                    <th>Category</th>
                    <th> Image </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      onMouseEnter={() => setHoveredCategory(category._id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <td>{category.name}</td>
                      <td>
                        <div className="image-container">
                          <img
                            src={`${category.category_image}`}
                            className="category-image"
                            style={{ width: "50px", height: "50px" }}
                          />
                          {hoveredCategory === category._id && (
                            <div className="mt-3">
                              <FaPencil
                                style={{ cursor: "pointer" }}
                                onClick={() => handleEdit(category)}
                              />
                              <MdDeleteForever
                                style={{ cursor: "pointer" }}
                                className="delete-icon ml-3"
                                onClick={() => handleDelete(category)}
                              />
                            </div>
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

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <FormControl
                type="text"
                defaultValue={selectedCategory?.name}
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <FormControl type="file" onChange={handleEditImageChange} />
            </Form.Group>
            {editFormData.category_image && (
              <img
                src={editFormData.category_image}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
            <Button variant="primary" onClick={confirmEdit} className="mt-3">
              Save changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
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

export default Category;
