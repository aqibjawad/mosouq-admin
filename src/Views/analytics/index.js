import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Breadcrumb, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { GET } from "../../apicontroller/ApiController";

import moment from "moment";

const Analytics = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await GET("businessStats/getAll");
      setStaffData(response);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data");
    }
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active> Business Stats </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={12} className="mt-3">
          <div className="card">
            <div className="card-body">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Stat Type</th>
                    <th>Business Name</th>
                    <th>Business Email</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {staffData && staffData.length > 0 ? (
                    staffData.map((staff, index) => (
                      <tr key={index}>
                        <td>{staff.type}</td>
                        <td>{staff.businessId.name}</td>
                        <td>{staff.businessId.email}</td>
                        <td>{staff.userId.name}</td>
                        <td>{staff.userId.email}</td>
                        <td>{moment(staff.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No staff data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
