import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { InputGroup, FormControl, Form, Card, Row, Col, Table, Button, Modal, Breadcrumb } from "react-bootstrap"

import { POST, GET, DELETE, PUT } from '../../apicontroller/ApiController';


const Blog = () => {

    const [image, setImage] = useState(null);

    const titleRef = useRef();
    const descriptionRef = useRef();


    const [blogs, setBlogs] = useState([]);

    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const submit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("title", titleRef.current.value);
        formData.append("description", descriptionRef.current.value);


        if (image) {
            formData.append("blog_image", image);
        }

        try {
            const res = await POST("blog/add-blog", formData);
            if (!res.error) {
                toast("Added Done");
                fetchData();
            } else {
                toast.error(res.sqlMessage);
            }
        } catch (error) {
            console.error('Error adding blog:', error);
            toast.error('Failed to add blog. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const fetchData = async () => {
        GET("blog/get-blogs").then((result) => {
            setBlogs(result);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>

            <Col sm={12} className="mt-3">
                <Breadcrumb>
                    <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
                    <Breadcrumb.Item active> Blog </Breadcrumb.Item>
                </Breadcrumb>
            </Col>

            <Row>
                <Col sm={4}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Form>
                                <div className="row">

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Title </Form.Label>
                                        <InputGroup className="mb-3" required >
                                            <FormControl ref={titleRef} type="text" />
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
                                        <th>Title</th>
                                        <th> Response Time </th>
                                        <th> Response Rate </th>
                                        <th> Description </th>
                                        <th> Image </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.map((blog) => (

                                        <tr>
                                            <td> {blog.title} </td>
                                            <td> {blog.response_time} </td>
                                            <td> {blog.response_rate} </td>
                                            <td> {blog.description} </td>
                                            <td> <img src={blog.blog_image} style={{width:"50px", height:"50px"}} /> </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Blog