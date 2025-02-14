import React, { useState, useEffect } from "react";
import { GET, POST } from "../../apicontroller/ApiController";
import Select from "react-select";
import { Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const AddFaqs = () => {
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GET("business-profile/getAll").then((result) => {
      setBusiness(result.businessProfiles);
    });
  }, []);

  // useEffect(() => {
  //   // Fetch existing FAQs when business is selected
  //   if (selectedBusiness) {
  //     setIsLoading(true);
  //     GET(`faqs/business/${selectedBusiness.value}`)
  //       .then((result) => {
  //         if (result.success && result.data.faqs.length > 0) {
  //           setFaqList(result.data.faqs);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching FAQs:", error);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [selectedBusiness]);

  const businessOptions = business.map((item) => ({
    value: item.businessId    ,
    label: item.businessName || item?.authDetails?.company || "Unknown Business",
  }));

  const handleAddFaq = () => {
    if (faqList.length < 5) {
      setFaqList([...faqList, { question: "", answer: "" }]);
    }
  };

  const handleRemoveFaq = (index) => {
    const newFaqList = [...faqList];
    newFaqList.splice(index, 1);
    setFaqList(newFaqList);
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqList = [...faqList];
    newFaqList[index][field] = value;
    setFaqList(newFaqList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBusiness) {
      toast.error("Please select a business");
      return;
    }

    // Validate FAQ entries
    const isValid = faqList.every(faq => faq.question.trim() && faq.answer.trim());
    if (!isValid) {
      toast.error("Please fill in all FAQ fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await POST("faqs/create", {
        businessId: selectedBusiness.value,
        faqs: faqList
      });

      if (response.success) {
        toast.success("FAQs saved successfully");
      } else {
        toast.error(response.message || "Failed to save FAQs");
      }
    } catch (error) {
      console.error("Error saving FAQs:", error);
      toast.error("An error occurred while saving FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Select Business</Form.Label>
          <Select
            value={selectedBusiness}
            onChange={setSelectedBusiness}
            options={businessOptions}
            isClearable
            isSearchable
            placeholder="Search and select business..."
            className="mb-3"
            isDisabled={isLoading}
          />
        </Form.Group>

        {faqList.map((faq, index) => (
          <Row key={index} className="align-items-end mb-3">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Question {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter question"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Answer {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter answer"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              {faqList.length > 1 && (
                <Button 
                  variant="danger" 
                  onClick={() => handleRemoveFaq(index)}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              )}
            </Col>
          </Row>
        ))}

        <div className="mt-3 d-flex gap-3">
          {faqList.length < 5 && (
            <Button 
              variant="secondary" 
              onClick={handleAddFaq}
              disabled={isLoading}
            >
              Add More
            </Button>
          )}
          <Button 
            variant="primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save FAQs"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddFaqs;