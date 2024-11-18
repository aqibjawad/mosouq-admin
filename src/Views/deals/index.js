import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET, DELETE } from '../../apicontroller/ApiController';
import { InputGroup, FormControl, Form, Card, Row, Col, Table, Button, Breadcrumb, Modal } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";

const Deals = () => {
    const [image, setImage] = useState(null);

    const nameRef = useRef();
    const typeRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();
    const consultationRef = useRef();

    const [deals, setDeals] = useState([]);

    const [hoveredDeal, setHoveredDeal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);

    const submit = async (event) => {
        event.preventDefault();

        if (!nameRef.current.value) {
            toast.error(' link field is required.', {
                className: 'custom-toast-container',
                bodyClassName: 'custom-toast-message'
            });
            return; // Prevent form submission
        }

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("type", typeRef.current.value);
        formData.append("location", locationRef.current.value);
        formData.append("description", descriptionRef.current.value);
        formData.append("consultation", consultationRef.current.value);

        if (image) {
            formData.append("deal_image", image);
        }

        try {
            const res = await POST("deal/add-deal", formData);
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
            console.error('Error deleting deal:', error);
            toast.error('Failed to delete deal. Please try again.');
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
                                            <FormControl type="text" ref={nameRef} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Deal Type </Form.Label>
                                        <InputGroup className="mb-3" required>
                                            <FormControl type="text" ref={typeRef} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Deal Location </Form.Label>
                                        <InputGroup className="mb-3" required>
                                            <FormControl type="text" ref={locationRef} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url">Deal Description</Form.Label>
                                        <InputGroup className="mb-3" required>
                                            <FormControl as="textarea" ref={descriptionRef} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Deal Consultation </Form.Label>
                                        <InputGroup className="mb-3" required>
                                            <FormControl type="text" ref={consultationRef} />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Deal Image </Form.Label>
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
                                        <th> Deal Name </th>
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
                                            <td>
                                                <div className="image-container">
                                                    <img src={`${deal.deal_image}`} style={{ width: "50px", height: "50px" }} />
                                                    {hoveredDeal === deal._id && (
                                                        <MdDeleteForever style={{fontSize:"25px"}} className="delete-icon ml-4" onClick={() => handleDelete(deal)} />
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
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Deals;
