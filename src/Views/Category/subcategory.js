import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import { POST, GET, DELETE } from "../../apicontroller/ApiController";

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
} from "react-bootstrap";

import { AiFillDelete } from "react-icons/ai";

import Swal from "sweetalert2";

const SubCategory = () => {
  const [imagePreview, setImagePreview] = useState(
    "https://via.placeholder.com/150"
  );

  const [formData, setFormData] = useState({
    category: "",
    sub_name: "",
    subcategory_image: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      const imageFormData = new FormData();
      imageFormData.append("file", file);

      try {
        const response = await POST("utils/upload-single-file", imageFormData);

        if (response && response?.data?.image) {
          setFormData((prevData) => ({
            ...prevData,
            subcategory_image: response?.data?.image,
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
      }
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        category: formData.category,
        sub_name: formData.sub_name,
        subcategory_image: formData.subcategory_image,
        description: formData.description,
      };

      const res = await POST("subcategory/add-subcategory", payload);
      if (!res.error) {
        toast("Added Done");
        fetchData();
        setFormData({
          category: "",
          sub_name: "",
          subcategory_image: "",
          description: "",
        });
        setImagePreview("https://via.placeholder.com/150");
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error adding Sub category:", error);
      toast.error("Failed to add sub category. Please try again.");
    }
  };

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);

  const fetchData = async () => {
    GET("category/get-categories").then((result) => {
      setCategories(result);
    });

    GET("subcategory/get-subcategories").then((result) => {
      setSubCategories(result);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (event, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await DELETE("subcategory/delete", id, "");
          toast("Subcategory deleted!");
          fetchData();
        } catch (error) {
          console.error("Error deleting subcategory:", error);
          toast.error("Failed to delete subcategory. Please try again.");
        }
      }
    });
  };

  return (
    <div>
      <Col sm={12} className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard"> Dashboard </Breadcrumb.Item>
          <Breadcrumb.Item active> Sub Categories </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Row>
        <Col sm={4}>
          <Card>
            <Card.Body>
              <Form>
                <div className="row">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="category"
                        onChange={handleInputChange}
                        value={formData.category}
                      >
                        <option value=""> --- Select --- </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Sub Category</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter subcategory name"
                        name="sub_name"
                        onChange={handleInputChange}
                        value={formData.sub_name}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                        name="description"
                        onChange={handleInputChange}
                        value={formData.description}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Image</Form.Label>
                      <FormControl type="file" onChange={handleImageChange} />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="submit">
                      <Button
                        onClick={submit}
                        variant="primary"
                        type="submit"
                        size="lg"
                        block
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

        <Col sm={8}>
          <div className="card">
            <div className="card-body">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Sub Category</th>
                    <th>Sub Cat Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((subcategory) => (
                    <tr key={subcategory._id}>
                      <td>{subcategory.sub_name}</td>
                      <td>
                        <img
                          src={`${subcategory.subcategory_image}`}
                          style={{ width: "50px", height: "50px" }}
                          alt="subcategory"
                        />
                      </td>
                      <td>
                        <AiFillDelete
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => remove(null, subcategory._id)}
                        />
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

export default SubCategory;
