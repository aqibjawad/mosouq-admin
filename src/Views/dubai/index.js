import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET, DELETE } from '../../apicontroller/ApiController';
import { InputGroup, FormControl, Form, Card, Row, Col, Table, Button, Breadcrumb, Modal } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";

const Dubai = () => {
    const [image, setImage] = useState(null);
    const nameRef = useRef();
    const descriptionRef = useRef();
    const [dubai, setDubai] = useState([]);
    const [hoveredDubai, setHoveredDubai] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDubai, setSelectedDubai] = useState(null);

    const submit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("description", descriptionRef.current.value);
        if (image) {
            formData.append("dubai_image", image);
        }

        try {
            const res = await POST("dubai/add-dubai", formData);
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
        GET("dubai/get-dubai").then((result) => {
            setDubai(result);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (dubai) => {
        setSelectedDubai(dubai);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await DELETE(`dubai/delete-dubai/${selectedDubai._id}`, "");
            if (!res.error) {
                toast("Deleted Done");
                fetchData();
                setShowDeleteModal(false);
            } else {
                toast.error(res.sqlMessage);
            }
        } catch (error) {
            console.error('Error deleting dubai:', error);
            toast.error('Failed to delete dubai. Please try again.');
        }
    };

    return (
        <div>
            <Col sm={12} className="mt-3">
                <Breadcrumb>
                    <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
                    <Breadcrumb.Item active> Companies </Breadcrumb.Item>
                </Breadcrumb>
            </Col>

            <Row>
                <Col sm={4}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Name </Form.Label>
                                        <InputGroup className="mb-3" required>
                                            <FormControl type="text" ref={nameRef} />
                                        </InputGroup>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Description </Form.Label>
                                        <InputGroup className="mb-3" required>
                                            <FormControl type="text" ref={descriptionRef} />
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
                                        <th> Name </th>
                                        <th> Description </th>
                                        <th> Image </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dubai.map((dubai) => (
                                        <tr
                                            key={dubai._id}
                                            onMouseEnter={() => setHoveredDubai(dubai._id)}
                                            onMouseLeave={() => setHoveredDubai(null)}
                                        >
                                            <td>{dubai.name}</td>
                                            <td>{dubai.description}</td>
                                            <td>
                                                <div className="image-container">
                                                    <img src={`${dubai.dubai_image}`} style={{ width: "50px", height: "50px" }} />
                                                    {hoveredDubai === dubai._id && (
                                                        <MdDeleteForever style={{ fontSize: "25px" }} className="delete-icon ml-4" onClick={() => handleDelete(dubai)} />
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
                    <Modal.Title>Delete Dubai</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this Dubai?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Dubai;
