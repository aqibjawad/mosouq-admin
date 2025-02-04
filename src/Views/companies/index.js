import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { POST, GET } from "../../apicontroller/ApiController";
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
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";

import { FaTrash } from "react-icons/fa";

const Companies = () => {
  const [formData, setFormData] = useState({
    link: "",
    companies_image: "",
  });

  const [imagePreview, setImagePreview] = useState(
    "https://via.placeholder.com/150"
  );

  const [companies, setCompanies] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true);

      const imageFormData = new FormData();
      imageFormData.append("file", file);

      try {
        const response = await POST("utils/upload-single-file", imageFormData);
        if (response && response?.data?.image) {
          setFormData((prevData) => ({
            ...prevData,
            companies_image: response?.data?.image,
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
      } finally {
        setIsUploading(false);
      }
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        link: formData.link,
        companies_image: formData.companies_image,
      };

      const res = await POST("company/add-company", payload);
      if (!res.error) {
        toast("Added successfully");
        fetchData();
        // Clear form after successful submission
        setFormData({
          link: "",
          companies_image: "",
        });
        setImagePreview("https://via.placeholder.com/150");
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company. Please try again.");
    }
  };

  const handleDelete = async (companyId) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await POST("company/delete-company", { id: companyId });
        if (!res.error) {
          toast.success("Company deleted successfully");
          fetchData(); // Refresh the list
        } else {
          toast.error(res.sqlMessage || "Failed to delete company");
        }
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    GET("company/get-companies").then((result) => {
      setCompanies(result);
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
                    <Form.Label htmlFor="basic-url">Company Link</Form.Label>
                    <InputGroup className="mb-3">
                      <FormControl
                        type="text"
                        name="link"
                        onChange={handleInputChange}
                        value={formData.link}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={12}>
                    <Form.Label htmlFor="basic-url">Image</Form.Label>
                    <InputGroup className="mb-3">
                      <FormControl
                        type="file"
                        onChange={handleImageChange}
                        disabled={isUploading}
                      />
                    </InputGroup>
                    {isUploading && (
                      <div className="text-center">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Uploading...</span>
                        </Spinner>
                      </div>
                    )}
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="submit">
                      <Button
                        onClick={submit}
                        variant="primary"
                        type="submit"
                        size="lg"
                        block
                        disabled={isUploading}
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
                    <th>Company Link</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company._id}>
                      <td>{company.link}</td>
                      <td>
                        <img
                          src={`${company.companies_image}`}
                          style={{ width: "50px", height: "50px" }}
                          alt="Company"
                        />
                      </td>
                      <td style={{cursor:"pointer"}}>
                        {/* <Button
                          variant="danger"
                          size="sm"
                          
                        >
                          Delete
                        </Button> */}
                        <FaTrash onClick={() => handleDelete(company._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Companies;
