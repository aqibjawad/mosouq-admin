import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET, DELETE, PUT } from '../../apicontroller/ApiController';
import { InputGroup, FormControl, Form, Card, Row, Col, Table, Button, Breadcrumb, Modal } from "react-bootstrap";

import { MdDeleteForever } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";


const Category = () => {
    
    const [image, setImage] = useState(null);
    const nameRef = useRef();
    const [categories, setCategories] = useState([]);

    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const submit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", nameRef.current.value);

        if (image) {
            formData.append("category_image", image);
        }

        try {
            const res = await POST("category/add-category", formData);
            if (!res.error) {
                toast("Added Done");
                fetchData();
            } else {
                toast.error(res.sqlMessage);
            }
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Failed to add category. Please try again.');
        }
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await DELETE(`category/delete-category/${selectedCategory._id}`, "");
            if (!res.error) {
                toast("Deleted Done");
                fetchData();
                setShowDeleteModal(false);
            } else {
                toast.error(res.sqlMessage);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category. Please try again.');
        }
    };

    const confirmEdit = async () => {
        const formData = new FormData();
        formData.append("name", nameRef.current.value);
    
        if (image) {
            formData.append("category_image", image);
        }
    
        try {
            const res = await PUT(`category/update-category/${selectedCategory._id}`, formData);
            if (!res.error) {
                toast("Updated Done");
                fetchData();
                setShowEditModal(false);
            } else {
                toast.error(res.sqlMessage);
            }
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Failed to update category. Please try again.');
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
                                        <InputGroup className="mb-3" required >
                                            <FormControl type="text" ref={nameRef} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Image </Form.Label>
                                        <InputGroup className="mb-3">
                                            <FormControl type="file" onChange={handleFileChange} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="submit">
                                            <Button onClick={submit} variant="primary" type="submit" size="lg" block>
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
                                        <tr key={category._id} onMouseEnter={() => setHoveredCategory(category._id)} onMouseLeave={() => setHoveredCategory(null)}>
                                            <td>{category.name}</td>
                                            <td>
                                                <div className="image-container">
                                                    <img src={`${category.category_image}`} className="category-image" style={{width:"50px", height:"50px"}} />
                                                    {hoveredCategory === category._id && (
                                                        <div className="mt-3">
                                                            <FaPencil style={{cursor:"pointer"}} onClick={()=> handleEdit(category)} />
                                                            <MdDeleteForever style={{cursor:"pointer"}} className="delete-icon ml-3" onClick={() => handleDelete(category)} />
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
                            <FormControl type="text" defaultValue={selectedCategory?.name} ref={nameRef} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <FormControl type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={confirmEdit}>Save changes</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;
