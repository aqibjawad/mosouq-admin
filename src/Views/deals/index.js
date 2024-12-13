import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { POST, GET } from "../../apicontroller/ApiController";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

import AddressPicker from "../../Components/addressPicker";

const ProfileForm = () => {
  const [currentSection, setCurrentSection] = useState(1);

  const [formData, setFormData] = useState({
    businessName: "",
    website: "",
    name: "",
    type: "",
    address: "",
    lat: "",
    lang: "",
    description: "",
    consultation: "",
    files: [],
    price: "",
    discount: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleBusinessPicturesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      files: [...prevState.files, ...files],
    }));
  };

  const handleContinue = () => setCurrentSection(2);
  const handleBack1 = () => setCurrentSection(1);

  const handleContinueSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        lat: formData.lat,
        lang: formData.lang,
        description: formData.description,
        consultation: formData.consultation,
        price: formData.price,
        discount: formData.discount,
      };

      const res = await POST("deal/add-deal", payload);

      if (!res.error) { 
        toast("Added Done");

        // Ensure dealId is extracted correctly from the response
        if (res.dealId) {
          setFormData((prev) => ({ ...prev, dealId: res.dealId }));
          setCurrentSection(2);
        } else {
          throw new Error("dealId is missing in the response");
        }
      } else {
        toast.error(res.sqlMessage);
      }
    } catch (error) {
      console.error("Error adding deals:", error);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const filesFormData = new FormData();

      formData.files.forEach((file) => {
        filesFormData.append("files", file);
      });

      // Append the dealId from formData
      filesFormData.append("dealId", formData.dealId);

      const filesResponse = await POST(
        "deal/upload-multiple-files",
        filesFormData
      );

      if (filesResponse?.data.length >= 1) {
        const uploadedLinks = filesResponse.data;

        const newApiResponse = await POST("deal/updateDealsImages", {
          dealId: formData.dealId,
          images: uploadedLinks,
        });

        if (newApiResponse.message) {
          Swal.fire({
            icon: "success",
            title: "Deal Submitted",
            text: "Your deal has been successfully submitted!",
          });
        } else {
          throw new Error("Failed to update business images");
        }
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceSelected = (place) => {
    if (place) {
      // Set the formatted address in the input field
      const formattedAddress = place.formatted_address || place.name || "";

      // Update form data with address, latitude, and longitude
      setFormData((prevData) => ({
        ...prevData,
        address: formattedAddress,
        lat: place.geometry?.location
          ? place.geometry.location.lat().toString()
          : "",
        lang: place.geometry?.location
          ? place.geometry.location.lng().toString()
          : "",
      }));

      // Optional: Log for debugging
      console.log("Selected Place:", {
        address: formattedAddress,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      });
    }
  };

  return (
    <div className="main-profile-head mt-5">
      {currentSection === 1 && (
        <>
          <Row className="">
            <Col lg={6}>
              <div>
                <label htmlFor="businessName" className="label">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  placeholder="Enter Business Name"
                  className="input-field"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Col>

            <Col lg={6}>
              <div>
                <label htmlFor="businessName" className="label">
                  Business website
                </label>
                <input
                  type="text"
                  name="website"
                  id="website"
                  placeholder="Enter Business Name"
                  className="input-field"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Col>

            <Col className="mt-2" lg={6}>
              <div>
                <label htmlFor="businessName" className="label">
                  Deal Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Business Name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Col>

            <Col className="mt-2">
              <div>
                <label htmlFor="website" className="label">
                  Deal type
                </label>
                <input
                  type="text"
                  name="type"
                  id="type"
                  placeholder="Enter Deal type"
                  className="input-field"
                  value={formData.type}
                  onChange={handleInputChange}
                />
              </div>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <div>
                <label htmlFor="city" className="label">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Enter City"
                  className="input-field"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Col>
            <Col>
              <div>
                <label htmlFor="zip" className="label">
                  search address
                </label>
                <AddressPicker onPlaceSelected={handlePlaceSelected} />
              </div>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col lg={4}>
              <div>
                <label htmlFor="address" className="label">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter Address"
                  className="input-field"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <label htmlFor="country" className="label">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  id="latitude"
                  placeholder="Latitude"
                  className="input-field"
                  value={formData.lat}
                  onChange={(e) =>
                    setFormData({ ...formData, lat: e.target.value })
                  }
                  required
                />
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <label htmlFor="country" className="label">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  id="longitude"
                  placeholder="Longitude"
                  className="input-field"
                  value={formData.lang}
                  onChange={(e) =>
                    setFormData({ ...formData, lang: e.target.value })
                  }
                  required
                />
              </div>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col lg={4}>
              <div>
                <label htmlFor="address" className="label">
                  Number:
                </label>
                <input
                  type="text"
                  name="consultation"
                  id="consultation"
                  placeholder="Enter Number"
                  className="input-field"
                  value={formData.consultation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Col>

            <Col lg={4}>
              <div>
                <label htmlFor="price" className="label">
                  Price:
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  placeholder="Enter price"
                  className="input-field"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <label htmlFor="discount" className="label">
                  Discount:
                </label>
                <input
                  type="text"
                  name="discount"
                  id="discount"
                  placeholder="Enter discount"
                  className="input-field"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  required
                />
              </div>
            </Col>

            <Col lg={8}>
              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter Description"
                  className="text-field"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col className="mt-3" lg={6} md={6} sm={12}></Col>
            <Col className="mt-3" lg={6} md={6} sm={12}>
              <div className="continue-btn" onClick={handleContinueSubmit}>
                Continue
              </div>
            </Col>
          </Row>
        </>
      )}

      {currentSection === 2 && (
        <>
          <Col md={12} className="pt-4 mt-5">
            <Form.Label htmlFor="files"> Pictures </Form.Label>
            <div
              style={{
                padding: "50px",
                border: "dotted",
                textAlign: "center",
              }}
            >
              <input
                type="file"
                id="files"
                name="files"
                multiple
                onChange={handleBusinessPicturesChange}
              />
              Drop files here or click to upload
            </div>
          </Col>

          <Row className="mt-5">
            <Col>
              <div onClick={handleBack1} className="back-btn">
                Back
              </div>
            </Col>
            <Col className="text-end">
              <div onClick={handleFinalSubmit} className="continue-btn">
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                {isLoading ? "Submitting Your Profile..." : "Submit"}
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProfileForm;
