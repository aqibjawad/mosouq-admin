import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";

const BusinessHoursSelector = () => {
  const [selectedDays, setSelectedDays] = useState({
    monday: { isOpen: false, open: "6:00 AM", close: "5:00 PM" },
    tuesday: { isOpen: true, open: "6:00 AM", close: "5:00 PM" },
    wednesday: { isOpen: true, open: "6:00 AM", close: "5:00 PM" },
    thursday: { isOpen: true, open: "6:00 AM", close: "5:00 PM" },
    friday: { isOpen: true, open: "6:00 AM", close: "5:00 PM" },
    saturday: { isOpen: false, open: "6:00 AM", close: "5:00 PM" },
    sunday: { isOpen: false, open: "6:00 AM", close: "5:00 PM" },
  });

  const timeOptions = [];
  for (let hour = 4; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date(2024, 0, 1, hour, minute);
      const timeString = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push(timeString);
    }
  }

  const handleToggle = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }));
  };

  const handleTimeChange = (day, type, time) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: time,
      },
    }));
  };

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {days.map(({ key, label }) => (
        <Row key={key} className="mb-3 align-items-center">
          <Col xs={3} className="text-capitalize">
            {label}
          </Col>
          <Col xs={2}>
            <Form.Check
              type="switch"
              id={`switch-${key}`}
              label={selectedDays[key].isOpen ? "Open" : "Closed"}
              checked={selectedDays[key].isOpen}
              onChange={() => handleToggle(key)}
            />
          </Col>
          {selectedDays[key].isOpen && (
            <>
              <Col xs={3}>
                <Form.Control
                  as="select"
                  value={selectedDays[key].open}
                  onChange={(e) =>
                    handleTimeChange(key, "open", e.target.value)
                  }
                >
                  {timeOptions.map((time) => (
                    <option key={`open-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col xs={1} className="text-center">
                -
              </Col>
              <Col xs={3}>
                <Form.Control
                  as="select"
                  value={selectedDays[key].close}
                  onChange={(e) =>
                    handleTimeChange(key, "close", e.target.value)
                  }
                >
                  {timeOptions.map((time) => (
                    <option key={`close-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </>
          )}
        </Row>
      ))}
    </div>
  );
};

export default BusinessHoursSelector;
