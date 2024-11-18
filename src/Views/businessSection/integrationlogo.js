import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET, DELETE, PUT } from '../../apicontroller/ApiController';
import { InputGroup, FormControl, Form, Card, Row, Col, Table, Button, Breadcrumb, Modal } from "react-bootstrap";

import { MdDeleteForever } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";

const IntergrationLogo = () => {

    const [image, setImage] = useState(null);
    const linkRef = useRef();

    const [companies, setCompanies] = useState([]);
    const [hoveredCompany, setHoveredCompany] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const submit = async (event) => {
        event.preventDefault();

        if (!linkRef.current.value) {
            toast.error('link field is required.', {
                className: 'custom-toast-container',
                bodyClassName: 'custom-toast-message'
            });
            return; // Prevent form submission
        }

        const formData = new FormData();
        formData.append("link", linkRef.current.value);

        if (image) {
            formData.append("integration_comp_image", image);
        }

        try {
            const res = await POST("integration-company/add-integ-company", formData);
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
        GET("integration-company/get-integ-companies").then((result) => {
            setCompanies(result);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (company) => {
        setSelectedCompany(company);
        setShowEditModal(true);
    };

    const handleDelete = (company) => {
        setSelectedCompany(company);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await DELETE(`company/delete-company/${selectedCompany._id}`, "");
            if (!res.error) {
                toast("Deleted Done");
                fetchData();
                setShowDeleteModal(false);
            } else {
                toast.error(res.sqlMessage);
            }
        } catch (error) {
            console.error('Error deleting Company:', error);
            toast.error('Failed to delete Company. Please try again.');
        }
    };

    const confirmEdit = async () => {
        const formData = new FormData();
        formData.append("link", linkRef.current.value);

        if (image) {
            formData.append("companies_image", image);
        }

        try {
            const res = await PUT(`company/update-company/${selectedCompany._id}`, formData);
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
                    <Breadcrumb.Item active> Integration Logo Section </Breadcrumb.Item>
                </Breadcrumb>
            </Col>

            <Row>
                <Col sm={4}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Company Link </Form.Label>
                                        <InputGroup className="mb-3" required >
                                            <FormControl type="text" ref={linkRef} />
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
                                        <th> Company Link </th>
                                        <th> Image </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map((company) => (
                                        <tr
                                            key={company._id}
                                            onMouseEnter={() => setHoveredCompany(company._id)}
                                            onMouseLeave={() => setHoveredCompany(null)}
                                        >
                                            <td>{company.link}</td>
                                            <td>
                                                <img src={`${company.integration_comp_image}`} style={{ width: "50px", height: "50px" }} />
                                                {hoveredCompany === company._id && (
                                                    <div className="mt-3">
                                                        <FaPencil style={{ cursor: "pointer" }} onClick={() => handleEdit(company)} />
                                                        <MdDeleteForever style={{ cursor: "pointer" }} className="delete-icon ml-3" onClick={() => handleDelete(company)} />
                                                    </div>
                                                )}
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
                    <Modal.Title>Edit Company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Company Link</Form.Label>
                            <FormControl type="text" defaultValue={selectedCompany?.link} ref={linkRef} />
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
                    <Modal.Title>Delete company</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this company?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default IntergrationLogo;
