import React from "react"

import {
    InputGroup,
    FormControl,
    Form,
    Card,
    Row,
    Col, Table, Button, Modal, Breadcrumb
} from "react-bootstrap"

const About = () => {
    return (
        <div>

            <Col sm={12} className="mt-3">
                <Breadcrumb>
                    <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
                    <Breadcrumb.Item active> About Us </Breadcrumb.Item>
                </Breadcrumb>
            </Col>

            <Row>
                <Col sm={4}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Form>
                                <div className="row">

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Description </Form.Label>
                                        <InputGroup className="mb-3" required >
                                            <FormControl type="text"  />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Facebook Link </Form.Label>
                                        <InputGroup className="mb-3" required >
                                            <FormControl type="text"  />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> LinkdIn Link </Form.Label>
                                        <InputGroup className="mb-3" required >
                                            <FormControl type="text"  />
                                        </InputGroup>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label htmlFor="basic-url"> Image </Form.Label>
                                        <InputGroup className="mb-3">
                                            <FormControl type="file" />
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

                <Col sm={8} className="mt-3">
                    <div className="card">
                        <div className="card-body">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr #</th>
                                        <th>DEscription</th>
                                        <th>LInk 1</th>
                                        <th>LInk 2</th>
                                        <th>Image</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>3</td>
                                        <td>Larry the Bird</td>
                                        <td>@twitter</td>
                                        <td>@twitter</td>
                                        <td>@twitter</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default About