import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { POST, GET } from "../../apicontroller/ApiController";
import { jwtDecode } from "jwt-decode";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

import AddressPicker from "../../Components/addressPicker";

import BusinessHoursSelector from "./businessHours";
import { Editor } from "@tinymce/tinymce-react";

const ProfileForm = () => {
  const token = localStorage.getItem("token");
  const data = jwtDecode(token);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [currentSection, setCurrentSection] = useState(1);
  const [isSelectiveHours, setIsSelectiveHours] = useState(false);
  const [isOpen24_7, setIsAllHours] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "https://via.placeholder.com/150"
  );

  const handleEditorChange = (content) => {
    handleInputChange({
      target: {
        name: "description",
        value: content,
      },
    });
  };

  const [is24Hours, setIs24Hours] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    city: "",
    address: "",
    country: "UAE",
    businessId: "",
    logo: "",
    description: "",
    files: [],
    isOpen24_7: false,
    fromTime: "",
    toTime: "",
    lang: "",
    lat: "",
    seoTitle: "",
    seoDescrp: "",
    businesshours: [],
  });

  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [timeSlots, setTimeSlots] = useState({
    monday: { from: "", to: "" },
    tuesday: { from: "", to: "" },
    wednesday: { from: "", to: "" },
    thursday: { from: "", to: "" },
    friday: { from: "", to: "" },
    saturday: { from: "", to: "" },
    sunday: { from: "", to: "" },
  });

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  useEffect(() => {
    // Filter only selected days and their time slots
    const businesshours = Object.keys(selectedDays)
      .filter(
        (day) => selectedDays[day] && timeSlots[day].from && timeSlots[day].to
      )
      .map((day) => ({
        day,
        fromTime: timeSlots[day].from,
        toTime: timeSlots[day].to,
      }));

    // Update form data with business hours
    setFormData((prev) => ({
      ...prev,
      businesshours,
    }));

    // Debugging logs
    // console.log(
    //   "Business Hours (Stringified):",
    //   JSON.stringify(businesshours, null, 2)
    // );
  }, [selectedDays, timeSlots]);

  useEffect(() => {
    GET(`category/get-categories`).then((result) => {
      const formattedOptions = result.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategoryOptions(formattedOptions);
    });

    GET(`subcategory/get-subcategories`).then((result) => {
      const formattedOptions = result.map((subcategory) => ({
        value: subcategory._id,
        label: subcategory.sub_name,
      }));
      setSubCategoryOptions(formattedOptions);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === "file") {
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

  const handleCategoryChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      category: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubCategoryChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      subcategory: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleContinueProfile = () => setCurrentSection(2);
  const handleContinue = () => setCurrentSection(3);
  const handleContinueDescription = () => setCurrentSection(4);
  const handleContinueHours = () => setCurrentSection(5);
  const handleBack1 = () => setCurrentSection(2);
  const handleBack = () => setCurrentSection(1);

  const navigation = useNavigate();

  const [formSignData, setFormSignData] = useState({
    name: "",
    company: "",
    email: "",
    country: "UAE",
    phone: "",
    website: "",
    role: "business",
  });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await POST("business/add-businessAdmin", formSignData);

      const { email, token, businessId } = response;

      console.log("Business ID:", response.businessId);

      setFormData((prevData) => ({
        ...prevData,

        businessId: response.businessId,
      }));

      setCurrentSection(2);
    } catch (error) {
      console.error("Error:", error);

      // Show error toast

      toast.error("Email is already in use", {
        duration: 3000, // Will show for 3 seconds

        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      // Create a FormData object for the logo
      const logoFormData = new FormData();
      logoFormData.append("file", file);
      logoFormData.append("businessId", formData.businessId);

      try {
        // Send the logo to the backend
        const logoResponse = await POST(
          "utils/upload-single-file",
          logoFormData
        );

        // Check if the response contains the file URL
        if (logoResponse && logoResponse?.data?.image) {
          // Update the form data with the received logo URL
          setFormData((prevData) => ({
            ...prevData,
            logo: logoResponse?.data?.image,
          }));

          Swal.fire({
            icon: "success",
            title: "Logo uploaded successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          throw new Error("Logo URL not received from the server");
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload logo. Please try again.",
        });
      }
    }
  };

  const handleContinueSubmit = async () => {
    try {
      setIsLoading(true);

      // Create an object to hold the form data
      const formEncodedData = {
        ...formData,
        // Stringify businesshours to ensure it's properly encoded
        businesshours: JSON.stringify(formData.businesshours),
        isOpen24_7: formData.isOpen24_7.toString(),
      };

      // Remove file fields as they can't be directly form-encoded
      delete formEncodedData.files;

      // Only include fromTime and toTime if not open 24/7
      if (!formEncodedData.isOpen24_7) {
        formEncodedData.fromTime = formData.fromTime || "";
        formEncodedData.toTime = formData.toTime || "";
      } else {
        delete formEncodedData.fromTime;
        delete formEncodedData.toTime;
      }

      // Remove any undefined values
      Object.keys(formEncodedData).forEach(
        (key) =>
          formEncodedData[key] === undefined && delete formEncodedData[key]
      );

      // Convert the object to a URL-encoded string
      const encodedData = Object.keys(formEncodedData)
        .map(
          (key) =>
            encodeURIComponent(key) +
            "=" +
            encodeURIComponent(formEncodedData[key])
        )
        .join("&");

      const profileResponse = await POST(
        "business-profile/add-business-profile",
        encodedData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // console.log(profileResponse);

      setCurrentSection(5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const filesFormData = new FormData();

      formData.files.forEach((file) => {
        filesFormData.append("files", file);
      });

      filesFormData.append("businessId", data._id.split(":")[0]);

      const filesResponse = await POST(
        "business-profile/upload-multiple-files",
        filesFormData
      );

      if (filesResponse?.data.length >= 1) {
        const uploadedLinks = filesResponse.data;

        const newApiResponse = await POST(
          "business-profile/updateBusinessImages",
          {
            businessId: formData.businessId,
            images: uploadedLinks,
          }
        );

        if (newApiResponse.message) {
          Swal.fire({
            icon: "success",
            title: "Profile Submitted",
            text: "Your profile has been successfully submitted!",
          });

          navigation("/business-show");
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

  const labelStyle = {
    color: "#666666",
    fontFamily: "Figtree",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "19.2px",
    textAlign: "left",
  };

  const handleChange = (e) => {
    setFormSignData({
      ...formSignData,
      [e.target.name]: e.target.value,
    });
  };

  const countries = [
    { value: "", label: "Select a country" },
    { value: "afghanistan", label: "Afghanistan" },
    { value: "albania", label: "Albania" },
    { value: "algeria", label: "Algeria" },
    { value: "andorra", label: "Andorra" },
    { value: "angola", label: "Angola" },
    { value: "antigua_and_barbuda", label: "Antigua and Barbuda" },
    { value: "argentina", label: "Argentina" },
    { value: "armenia", label: "Armenia" },
    { value: "australia", label: "Australia" },
    { value: "austria", label: "Austria" },
    { value: "azerbaijan", label: "Azerbaijan" },
    { value: "bahamas", label: "Bahamas" },
    { value: "bahrain", label: "Bahrain" },
    { value: "bangladesh", label: "Bangladesh" },
    { value: "barbados", label: "Barbados" },
    { value: "belarus", label: "Belarus" },
    { value: "belgium", label: "Belgium" },
    { value: "belize", label: "Belize" },
    { value: "benin", label: "Benin" },
    { value: "bhutan", label: "Bhutan" },
    { value: "bolivia", label: "Bolivia" },
    { value: "bosnia_and_herzegovina", label: "Bosnia and Herzegovina" },
    { value: "botswana", label: "Botswana" },
    { value: "brazil", label: "Brazil" },
    { value: "brunei", label: "Brunei" },
    { value: "bulgaria", label: "Bulgaria" },
    { value: "burkina_faso", label: "Burkina Faso" },
    { value: "burundi", label: "Burundi" },
    { value: "cabo_verde", label: "Cabo Verde" },
    { value: "cambodia", label: "Cambodia" },
    { value: "cameroon", label: "Cameroon" },
    { value: "canada", label: "Canada" },
    { value: "central_african_republic", label: "Central African Republic" },
    { value: "chad", label: "Chad" },
    { value: "chile", label: "Chile" },
    { value: "china", label: "China" },
    { value: "colombia", label: "Colombia" },
    { value: "comoros", label: "Comoros" },
    { value: "congo", label: "Congo" },
    {
      value: "congo_democratic_republic",
      label: "Congo (Democratic Republic)",
    },
    { value: "costa_rica", label: "Costa Rica" },
    { value: "croatia", label: "Croatia" },
    { value: "cuba", label: "Cuba" },
    { value: "cyprus", label: "Cyprus" },
    { value: "czech_republic", label: "Czech Republic" },
    { value: "denmark", label: "Denmark" },
    { value: "djibouti", label: "Djibouti" },
    { value: "dominica", label: "Dominica" },
    { value: "dominican_republic", label: "Dominican Republic" },
    { value: "east_timor", label: "East Timor" },
    { value: "ecuador", label: "Ecuador" },
    { value: "egypt", label: "Egypt" },
    { value: "el_salvador", label: "El Salvador" },
    { value: "equatorial_guinea", label: "Equatorial Guinea" },
    { value: "eritrea", label: "Eritrea" },
    { value: "estonia", label: "Estonia" },
    { value: "eswatini", label: "Eswatini" },
    { value: "ethiopia", label: "Ethiopia" },
    { value: "fiji", label: "Fiji" },
    { value: "finland", label: "Finland" },
    { value: "france", label: "France" },
    { value: "gabon", label: "Gabon" },
    { value: "gambia", label: "Gambia" },
    { value: "georgia", label: "Georgia" },
    { value: "germany", label: "Germany" },
    { value: "ghana", label: "Ghana" },
    { value: "greece", label: "Greece" },
    { value: "grenada", label: "Grenada" },
    { value: "guatemala", label: "Guatemala" },
    { value: "guinea", label: "Guinea" },
    { value: "guinea_bissau", label: "Guinea-Bissau" },
    { value: "guyana", label: "Guyana" },
    { value: "haiti", label: "Haiti" },
    { value: "honduras", label: "Honduras" },
    { value: "hungary", label: "Hungary" },
    { value: "iceland", label: "Iceland" },
    { value: "india", label: "India" },
    { value: "indonesia", label: "Indonesia" },
    { value: "iran", label: "Iran" },
    { value: "iraq", label: "Iraq" },
    { value: "ireland", label: "Ireland" },
    { value: "israel", label: "Israel" },
    { value: "italy", label: "Italy" },
    { value: "jamaica", label: "Jamaica" },
    { value: "japan", label: "Japan" },
    { value: "jordan", label: "Jordan" },
    { value: "kazakhstan", label: "Kazakhstan" },
    { value: "kenya", label: "Kenya" },
    { value: "kiribati", label: "Kiribati" },
    { value: "korea_north", label: "Korea (North)" },
    { value: "korea_south", label: "Korea (South)" },
    { value: "kosovo", label: "Kosovo" },
    { value: "kuwait", label: "Kuwait" },
    { value: "kyrgyzstan", label: "Kyrgyzstan" },
    { value: "laos", label: "Laos" },
    { value: "latvia", label: "Latvia" },
    { value: "lebanon", label: "Lebanon" },
    { value: "lesotho", label: "Lesotho" },
    { value: "liberia", label: "Liberia" },
    { value: "libya", label: "Libya" },
    { value: "liechtenstein", label: "Liechtenstein" },
    { value: "lithuania", label: "Lithuania" },
    { value: "luxembourg", label: "Luxembourg" },
    { value: "madagascar", label: "Madagascar" },
    { value: "malawi", label: "Malawi" },
    { value: "malaysia", label: "Malaysia" },
    { value: "maldives", label: "Maldives" },
    { value: "mali", label: "Mali" },
    { value: "malta", label: "Malta" },
    { value: "marshall_islands", label: "Marshall Islands" },
    { value: "mauritania", label: "Mauritania" },
    { value: "mauritius", label: "Mauritius" },
    { value: "mexico", label: "Mexico" },
    { value: "micronesia", label: "Micronesia" },
    { value: "moldova", label: "Moldova" },
    { value: "monaco", label: "Monaco" },
    { value: "mongolia", label: "Mongolia" },
    { value: "montenegro", label: "Montenegro" },
    { value: "morocco", label: "Morocco" },
    { value: "mozambique", label: "Mozambique" },
    { value: "myanmar", label: "Myanmar" },
    { value: "namibia", label: "Namibia" },
    { value: "nauru", label: "Nauru" },
    { value: "nepal", label: "Nepal" },
    { value: "netherlands", label: "Netherlands" },
    { value: "new_zealand", label: "New Zealand" },
    { value: "nicaragua", label: "Nicaragua" },
    { value: "niger", label: "Niger" },
    { value: "nigeria", label: "Nigeria" },
    { value: "north_macedonia", label: "North Macedonia" },
    { value: "norway", label: "Norway" },
    { value: "oman", label: "Oman" },
    { value: "pakistan", label: "Pakistan" },
    { value: "palau", label: "Palau" },
    { value: "palestine", label: "Palestine" },
    { value: "panama", label: "Panama" },
    { value: "papua_new_guinea", label: "Papua New Guinea" },
    { value: "paraguay", label: "Paraguay" },
    { value: "peru", label: "Peru" },
    { value: "philippines", label: "Philippines" },
    { value: "poland", label: "Poland" },
    { value: "portugal", label: "Portugal" },
    { value: "qatar", label: "Qatar" },
    { value: "romania", label: "Romania" },
    { value: "russia", label: "Russia" },
    { value: "rwanda", label: "Rwanda" },
    { value: "saint_kitts_and_nevis", label: "Saint Kitts and Nevis" },
    { value: "saint_lucia", label: "Saint Lucia" },
    {
      value: "saint_vincent_and_the_grenadines",
      label: "Saint Vincent and the Grenadines",
    },
    { value: "samoa", label: "Samoa" },
    { value: "san_marino", label: "San Marino" },
    { value: "sao_tome_and_principe", label: "Sao Tome and Principe" },
    { value: "saudi_arabia", label: "Saudi Arabia" },
    { value: "senegal", label: "Senegal" },
    { value: "serbia", label: "Serbia" },
    { value: "seychelles", label: "Seychelles" },
    { value: "sierra_leone", label: "Sierra Leone" },
    { value: "singapore", label: "Singapore" },
    { value: "slovakia", label: "Slovakia" },
    { value: "slovenia", label: "Slovenia" },
    { value: "solomon_islands", label: "Solomon Islands" },
    { value: "somalia", label: "Somalia" },
    { value: "south_africa", label: "South Africa" },
    { value: "south_sudan", label: "South Sudan" },
    { value: "spain", label: "Spain" },
    { value: "sri_lanka", label: "Sri Lanka" },
    { value: "sudan", label: "Sudan" },
    { value: "suriname", label: "Suriname" },
    { value: "sweden", label: "Sweden" },
    { value: "switzerland", label: "Switzerland" },
    { value: "syria", label: "Syria" },
    { value: "taiwan", label: "Taiwan" },
    { value: "tajikistan", label: "Tajikistan" },
    { value: "tanzania", label: "Tanzania" },
    { value: "thailand", label: "Thailand" },
    { value: "togo", label: "Togo" },
    { value: "tonga", label: "Tonga" },
    { value: "trinidad_and_tobago", label: "Trinidad and Tobago" },
    { value: "tunisia", label: "Tunisia" },
    { value: "turkey", label: "Turkey" },
    { value: "turkmenistan", label: "Turkmenistan" },
    { value: "tuvalu", label: "Tuvalu" },
    { value: "uganda", label: "Uganda" },
    { value: "ukraine", label: "Ukraine" },
    { value: "united_arab_emirates", label: "United Arab Emirates" },
    { value: "united_kingdom", label: "United Kingdom" },
    { value: "united_states", label: "United States" },
    { value: "uruguay", label: "Uruguay" },
    { value: "uzbekistan", label: "Uzbekistan" },
    { value: "vanuatu", label: "Vanuatu" },
    { value: "vatican_city", label: "Vatican City" },
    { value: "venezuela", label: "Venezuela" },
    { value: "vietnam", label: "Vietnam" },
    { value: "yemen", label: "Yemen" },
    { value: "zambia", label: "Zambia" },
    { value: "zimbabwe", label: "Zimbabwe" },
  ];

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
          <form style={{ paddingLeft: "2rem" }}>
            <Row>
              <Col lg={6} md={6} sm={12}>
                <label htmlFor="website" className="label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Your Name"
                  className="input-field"
                  value={formSignData.name}
                  onChange={handleChange}
                />
              </Col>

              <Col lg={6} md={6} sm={12}>
                <label htmlFor="website" className="label">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  placeholder="Enter Company Name"
                  className="input-field"
                  value={formSignData.company}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mt-5">
              <Col lg={6} md={6} sm={12}>
                <label htmlFor="website" className="label">
                  Company Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter Business email"
                  className="input-field"
                  value={formSignData.email}
                  onChange={handleChange}
                />
              </Col>

              <Col lg={6} md={6} sm={12}>
                <label htmlFor="website" className="label">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter Business phone"
                  className="input-field"
                  value={formSignData.phone}
                  onChange={handleChange}
                />
              </Col>

              <Col className="mt-3 mb-3">
                <div>
                  <label htmlFor="website" className="label">
                    Business Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    placeholder="Enter Business Website"
                    className="input-field"
                    value={formSignData.website}
                    onChange={handleChange}
                  />
                </div>
              </Col>

              <Col className="mt-3" lg={6} md={6} sm={12}>
                <label htmlFor="website" className="label">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Enter Business password"
                  className="input-field"
                  value={formSignData.password}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </form>

          <Row>
            <Col className="mt-5" lg={12} md={12} sm={12}>
              <div className="continue-btn" onClick={handleSignUpSubmit}>
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                {isLoading ? "...Continue" : "Continue"}
              </div>
            </Col>
          </Row>
        </>
      )}

      {currentSection === 2 && (
        <>
          <Row className="mt-5 justify-content-center">
            {/* Image section here */}
            <Row>
              <Col
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <img
                  src={imagePreview}
                  alt="Upload"
                  className="img-thumbnail"
                />
              </Col>
              <Col
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <div className="image-upload">
                  <label htmlFor="file-input" className="continue-btn">
                    Choose Logo
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    className="file-input"
                    onChange={handleImageChange}
                  />
                  <div>Maximum File Size 1MB</div>
                </div>
              </Col>
            </Row>
          </Row>

          <Row className="mt-5">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Select
                  options={categoryOptions}
                  placeholder="Select Category"
                  required
                  value={
                    categoryOptions.find(
                      (option) => option.value === formData.category
                    ) || null
                  }
                  onChange={handleCategoryChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Sub Category</Form.Label>
                <Select
                  options={subCategoryOptions}
                  placeholder="Select Sub Category"
                  required
                  value={
                    subCategoryOptions.find(
                      (option) => option.value === formData.subcategory
                    ) || null
                  }
                  onChange={handleSubCategoryChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div>
            <div className="business-prof-setup-head mt-5">
              Business Address
            </div>
            <div className="business-prof-descrp">
              Add your main office address if you have multiple locations
            </div>

            <Row className="mt-5">
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
          </div>

          <Row className="mt-5">
            <Col>
              <div onClick={handleBack} className="back-btn">
                Back
              </div>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <div className="continue-btn" onClick={handleContinueDescription}>
                Continue
              </div>
            </Col>
          </Row>
        </>
      )}

      {currentSection === 3 && ""}

      {currentSection === 4 && (
        <>
          <Row className="mt-5">
            <Col lg={12} className="mt-3">
              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <Editor
                  apiKey="q52q0lhptx8f862ep5ichss9wa4yfqjys86yeo2ltmbgwafj"
                  value={formData.description}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                      "lists",
                      "fontsize", // Add fontsize plugin
                    ],
                    toolbar: [
                      "undo redo | formatselect | fontsizeselect | bold italic backcolor", // Added fontsizeselect
                      "alignleft aligncenter alignright alignjustify",
                      "bullist numlist outdent indent | removeformat | help",
                    ].join(" | "),
                    fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt",
                    content_style: `
        body { font-size: 14pt; }
        ul { list-style-type: disc; margin-left: 20px; }
        ol { list-style-type: decimal; margin-left: 20px; }
        ul ul { list-style-type: circle; }
        ol ol { list-style-type: lower-alpha; }
      `,
                    content_css: false,
                    forced_root_block_attrs: {
                      style: "font-size: 14pt",
                    },
                    // Set default font size
                    font_size_style_values:
                      "8pt,10pt,12pt,14pt,16pt,18pt,24pt,36pt",
                    font_size_legacy_values:
                      "8pt,10pt,12pt,14pt,16pt,18pt,24pt,36pt",
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </Col>

            <Col lg={6} className="mt-3">
              <div>
                <label htmlFor="location" className="label">
                  Contact Option For your business
                </label>
                <select
                  name="location"
                  id="location"
                  className="input-field"
                  required
                >
                  <option value="">Select Contact</option>
                  <option value="chat"> Chat With Us </option>
                  <option value="consultations">
                    {" "}
                    Request For consultation{" "}
                  </option>
                  <option value="reservations"> Rservations </option>
                  <option value="reservations"> Call Us </option>
                </select>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={6} md={6} sm={12}>
              <label htmlFor="website" className="label">
                Seo Title
              </label>
              <input
                type="text"
                name="seoTitle"
                id="seoTitle"
                placeholder="Enter Title for seo"
                className="input-field"
                value={formData.seoTitle}
                onChange={handleInputChange}
              />
            </Col>

            <Col lg={6} md={6} sm={12}>
              <label htmlFor="website" className="label">
                SEO Description
              </label>
              <input
                type="text"
                name="seoDescrp"
                id="seoDescrp"
                placeholder="Enter SEO Description"
                className="input-field"
                value={formData.seoDescrp}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <div className="business-prof-setup-head"> Select Your Hours </div>

          <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelectiveHours}
                  onChange={() => {
                    setIsSelectiveHours(!isSelectiveHours);
                    if (is24Hours) setIs24Hours(false);
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Selective Hours</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOpen24_7}
                  onChange={() => {
                    setFormData((prevData) => ({
                      ...prevData,
                      isOpen24_7: !prevData.isOpen24_7,
                      // Clear time fields if now 24/7
                      ...(prevData.isOpen24_7
                        ? { fromTime: "", toTime: "" }
                        : {}),
                    }));
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>24 Hours</span>
              </label>
            </div>
            {isSelectiveHours && (
              <BusinessHoursSelector
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                timeSlots={timeSlots}
                setTimeSlots={setTimeSlots}
                days={days}
                onChange={(businesshours) => {
                  setFormData((prev) => ({
                    ...prev,
                    businesshours,
                  }));
                }}
              />
            )}
          </div>

          <Row className="mt-5">
            <Col>
              <div onClick={handleBack1} className="back-btn">
                Back
              </div>
            </Col>
            <Col className="text-end">
              <div onClick={handleContinueSubmit} className="continue-btn">
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                {isLoading ? "Continue..." : "Continue"}
              </div>
            </Col>
          </Row>
        </>
      )}

      {currentSection === 5 && (
        <>
          <Col md={12} className="pt-4 mt-5">
            <Form.Label htmlFor="files">Add Your Business Pictures</Form.Label>
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
