import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";

import "./index.css";

import { GET } from "../../apicontroller/ApiController";

import TrafficChart from "./trafficChart";

const Dashboard = () => {
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [business, setBusiness] = useState([]);
  const [dubai, setDubai] = useState([]);
  const [deals, setDeals] = useState([]);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    GET("category/get-categories").then((result) => {
      setCategory(result);
    });

    GET("subcategory/get-subcategories").then((result) => {
      setSubCategory(result);
    });

    GET("business-profile/getall").then((result) => {
      setBusiness(result.businessProfiles);
    });

    GET("dubai/get-dubai").then((result) => {
      setDubai(result);
    });

    GET("deal/get-deals").then((result) => {
      setDeals(result);
    });

    GET("reviews/getCount").then((result) => {
      setReviews(result);
    });
  }, []);

  return (
    <div>
      <Row className="mb-5">
        <Col className="mt-5" lg={12}>
          <Row>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {reviews.approved}
                        </Col>
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Approved Reviews
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {reviews.pending}
                        </Col>
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Pending Reviews
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {category.length || 0}
                        </Col>

                        {/* ... */}
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Category
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {subCategory.length || 0}
                        </Col>

                        {/* ... */}
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Sub Category
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {business.length || 0}
                        </Col>

                        {/* ... */}
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Businesses
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {dubai.length || 0}
                        </Col>

                        {/* ... */}
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Dubai
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <div>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          style={{
                            fontWeight: "200",
                            fontSize: "30px",
                            color: "#252C58",
                          }}
                        >
                          {deals.length || 0}
                        </Col>
                      </Row>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div
                      style={{
                        fontWeight: "300",
                        fontSize: "19px",
                        color: "#252C58",
                      }}
                    >
                      Deals
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Col>
      </Row>

      <div className="responsive-image-container">
        <TrafficChart />
      </div>

      {/* ... */}
    </div>
  );
};

export default Dashboard;