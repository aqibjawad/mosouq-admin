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

const SubCategory = () => {
  const [image, setImage] = useState();

  // Submit Values
  const categoryRef = useRef();
  const descriptionRef = useRef();

  const sub_nameRef = useRef();

  const submit = async (event) => {
    event.preventDefault();

    if (!sub_nameRef.current.value) {
      toast.error("Category Name field is required.", {
        className: "custom-toast-container",
        bodyClassName: "custom-toast-message",
      });
      return;
    }

    const formData = new FormData();
    formData.append("sub_name", sub_nameRef.current.value);
    formData.append("category", categoryRef.current.value);
    formData.append("description", descriptionRef.current.value);

    if (image) {
      formData.append("subcategory_image", image);
    }

    try {
      const res = await POST("subcategory/add-subcategory", formData);
      if (!res.error) {
        toast("Added Done");

        fetchData();
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error adding Sub category:", error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    console.log("Selected image:", file);
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
                        ref={categoryRef}
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
                        ref={sub_nameRef}
                        type="text"
                        placeholder="Product"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label>Sub Category Description</Form.Label>
                      <Form.Control ref={descriptionRef} as="textarea" placeholder="Product" />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="">
                      <Form.Label> Image </Form.Label>
                      <FormControl type="file" onChange={handleFileChange} />
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
