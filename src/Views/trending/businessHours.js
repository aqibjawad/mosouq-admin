import React, { useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";

const BusinessHoursSelector = ({ onChange }) => {
  const [selectedDays, setSelectedDays] = React.useState({
    monday: { isOpen: true, open: "06:00", close: "17:00" },
    tuesday: { isOpen: true, open: "06:00", close: "17:00" },
    wednesday: { isOpen: true, open: "06:00", close: "17:00" },
    thursday: { isOpen: true, open: "06:00", close: "17:00" },
    friday: { isOpen: true, open: "06:00", close: "17:00" },
    saturday: { isOpen: false, open: "06:00", close: "17:00" },
    sunday: { isOpen: false, open: "06:00", close: "17:00" },
  });

  useEffect(() => {
    const businesshours = Object.entries(selectedDays)
      .filter(([_, value]) => value.isOpen)
      .map(([day, value]) => ({
        day: day.toLowerCase(),
        fromTime: value.open,
        toTime: value.close,
      }));
    onChange(businesshours);
  }, [selectedDays, onChange]);

  // Convert 24h time to 12h format
  const to12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Generate 24-hour time options
  const generate24HourTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generate24HourTimes();

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
                      {time} ({to12Hour(time)})
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
                      {time} ({to12Hour(time)})
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
