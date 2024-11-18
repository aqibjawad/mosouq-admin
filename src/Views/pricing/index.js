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
  Dropdown,
} from "react-bootstrap";

import { MdDeleteForever } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";

const BusinessPricing = () => {
  const nameRef = useRef();
  const typeRef = useRef();
  const amountRef = useRef();
  const descriptionRef = useRef();
  const editNameRef = useRef();
  
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const submit = async (event) => {
    event.preventDefault(); 

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("type", typeRef.current.value);
    formData.append("amount", amountRef.current.value);
    formData.append("description", descriptionRef.current.value);

    try {
      const res = await POST("type/add-price", formData);
      if (!res.error) {
        toast("Added Done"); 
        // fetchData();
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  // const fetchData = async () => {
  //   try {
  //     const result = await GET("category/get-categories");
  //     setCategories(result);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const handleEdit = (category) => {
  //   setSelectedCategory(category);
  //   setShowEditModal(true);
  // };

  // const handleDelete = (category) => {
  //   setSelectedCategory(category);
  //   setShowDeleteModal(true);
  // };

  // const confirmDelete = async () => {
  //   try {
  //     const res = await DELETE(`business-type/delete-category/${selectedCategory._id}`, "");
  //     if (!res.error) {
  //       toast("Deleted Done");
  //       fetchData();
  //       setShowDeleteModal(false);
  //     } else {
  //       toast.error(res.sqlMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //     toast.error("Failed to delete category. Please try again.");
  //   }
  // };

  // const confirmEdit = async () => {
  //   const formData = new FormData();
  //   formData.append("name", editNameRef.current.value);

  //   try {
  //     const res = await PUT(`category/update-category/${selectedCategory._id}`, formData);
  //     if (!res.error) {
  //       toast("Updated Done");
  //       fetchData();
  //       setShowEditModal(false);
  //     } else {
  //       toast.error(res.sqlMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error updating category:", error);
  //     toast.error("Failed to update category. Please try again.");
  //   }
  // };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>Category</Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={4}>
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={submit}>
                <div className="row">
                  <Col md={12}>
                    <Form.Label htmlFor="basic-url">Pricing Title</Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl type="text" ref={nameRef} />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label>Pricing Type</Form.Label>
                      <Form.Control as="select" ref={typeRef} required>
                        <option value="">--- Select ---</option>
                        <option value="1">Basic</option>
                        <option value="2">Pro</option>
                        <option value="3">Enterprise</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url">Pricing Amount</Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl type="text" ref={amountRef} />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url">Pricing Description</Form.Label>
                    <InputGroup className="mb-3" required>
                      <FormControl type="text" ref={descriptionRef} />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="submit">
                      <Button variant="primary" type="submit" size="lg" block>
                        Submit
                      </Button>
                    </Form.Group>
                  </Col>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* <Col sm={8} className="mt-3">
          <Card>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Image</th>
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
                            src={category.category_image}
                            className="category-image"
                            alt="Category"
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
            </Card.Body>
          </Card>
        </Col> */}
      </Row>

      {/* <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
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
                ref={editNameRef}
              />
            </Form.Group>
            <Button variant="primary" onClick={confirmEdit}>
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
      </Modal> */}
    </div>
  );
};

export default BusinessPricing;
