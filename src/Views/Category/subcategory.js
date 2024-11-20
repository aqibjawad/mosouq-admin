import React, { useRef, useState, useEffect, useMemo } from "react";

import { toast } from "react-toastify";

import {
  POST,
  GET,
  DELETE,
  GETID,
  PUT,
} from "../../apicontroller/ApiController";

import {
  InputGroup,
  FormControl,
  Form,
  Card,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Breadcrumb,
} from "react-bootstrap";

import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";

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

      // Create a FormData object for the image
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      try {
        // Send the image to the backend
        const response = await POST("utils/upload-single-file", imageFormData);

        // Check if the response contains the file URL
        if (response && response?.data?.image) {
          // Update the form data with the received image URL
          setFormData((prevData) => ({
            ...prevData,
            subcategory_image: response?.data?.image, // Store the Cloudinary URL
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
        subcategory_image: formData.subcategory_image, // This will now have the correct image URL
        description: formData.description,
      };

      const res = await POST("subcategory/add-subcategory", payload);
      if (!res.error) {
        toast("Added Done");
        fetchData();
        // Reset form after successful submission
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

  const [category, setCategoryId] = useState([]);

  // ---------------- Get Data ------------------------
  const [categories, setCategories] = useState([]);

  const [subcategories, setSubCategories] = useState([]);

  console.log(subcategories);

  console.log(subcategories);

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

  // const [delShow, setDelShow] = useState(false);
  // const handleCloseDel = () => setDelShow(false);
  // const handleShowDel = () => setDelShow(true);

  // const delView = async (event, id) => {
  //     GETID("category/finddelete", id, '').then((result) => {
  //         setCategoryId(result);
  //     });
  //     handleShowDel();
  // };

  // const remove = async (event, id) => {
  //     await DELETE("category/delete", id, "").then((result) => {
  //         toast("Product deleted! ")
  //         fetchData();
  //     })
  // };

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
          <Card className="">
            <Card.Body>
              <Form>
                <div className="row">
                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label> Category </Form.Label>
                      <Form.Control
                        className="form-control"
                        as="select"
                        name="category" // Add this
                        onChange={handleInputChange}
                        value={formData.category}
                      >
                        <option value=""> --- Select --- </option>
                        {categories.map((category) => (
                          <option value={category._id}>{category.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label> Sub Category</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Product"
                        name="sub_name" // Add this
                        onChange={handleInputChange}
                        value={formData.sub_name}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label>Sub Category Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Product"
                        name="description" // Add this
                        onChange={handleInputChange}
                        value={formData.description}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label> Image </Form.Label>
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

        <Col sm={8} className="">
          <div className="card">
            <div className="card-body">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {/* <th>Category</th> */}
                    <th>Sub Category</th>
                    <th>Sub Cat Image</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((subcategory) => (
                    <tr>
                      {/* <td>{subcategory.category.name}</td> */}
                      <td>{subcategory.sub_name}</td>
                      <td>
                        <img
                          src={`${subcategory.subcategory_image}`}
                          style={{ width: "50px", height: "50px" }}
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
