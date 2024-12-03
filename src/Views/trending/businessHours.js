import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "./timePicker.css"; // Add your custom styles here
import { ChevronUp, ChevronDown } from "lucide-react"; 
// TimePicker Component
const TimePicker = ({ value, onChange }) => {
  const [hour, setHour] = useState(() => value.split(":")[0] || "12");
  const [minute, setMinute] = useState(() => value.split(":")[1] || "00");
  const [period, setPeriod] = useState("AM");

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const handleChange = (h, m, p) => {
    onChange(`${h}:${m} ${p}`);
  };

  return (
    <div className="time-picker">
      <div className="picker-container">
        {/* Hours Picker */}
        <div className="scroll-picker">
          {hours.map((h) => (
            <div
              key={h}
              className={`picker-item ${hour === h ? "active" : ""}`}
              onClick={() => setHour(h)}
            >
              {h}
            </div>
          ))}
        </div>

        <span className="colon">:</span>

        {/* Minutes Picker */}
        <div className="scroll-picker">
          {minutes.map((m) => (
            <div
              key={m}
              className={`picker-item ${minute === m ? "active" : ""}`}
              onClick={() => setMinute(m)}
            >
              {m}
            </div>
          ))}
        </div>

        {/* Period Picker */}
        <div className="scroll-picker">
          {periods.map((p) => (
            <div
              key={p}
              className={`picker-item ${period === p ? "active" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// TimeSelect Component (Your original component)
const TimeSelect = ({ value, onChange }) => {
  const [hours, setHours] = useState(() => value.split(":")[0] || "00");
  const [minutes, setMinutes] = useState(() => value.split(":")[1] || "00");

  const handleHourChange = (delta) => {
    const newHours = (parseInt(hours) + delta + 24) % 24;
    setHours(newHours);
    onChange(
      `${newHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleMinuteChange = (delta) => {
    const newMinutes = (parseInt(minutes) + delta + 60) % 60;
    setMinutes(newMinutes);
    onChange(
      `${hours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  return (
    <div className="d-flex align-items-center gap-1 border rounded px-2 py-1">
      <div className="d-flex flex-column align-items-center">
        <button
          type="button"
          onClick={() => handleHourChange(1)}
          className="btn btn-link p-1"
        >
          <ChevronUp size={16} />
        </button>
        <span className="small w-6 text-center">
          {hours.toString().padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => handleHourChange(-1)}
          className="btn btn-link p-1"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <span className="small">:</span>

      <div className="d-flex flex-column align-items-center">
        <button
          type="button"
          onClick={() => handleMinuteChange(1)}
          className="btn btn-link p-1"
        >
          <ChevronUp size={16} />
        </button>
        <span className="small w-6 text-center">
          {minutes.toString().padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => handleMinuteChange(-1)}
          className="btn btn-link p-1"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

// BusinessHoursSelector Component
const BusinessHoursSelector = ({
  selectedDays,
  setSelectedDays,
  timeSlots,
  setTimeSlots,
  days,
}) => {
  const handleDayToggle = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setTimeSlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  return (
    <div className="d-flex flex-column gap-4">
      {days.map(({ key, label }) => (
        <Card key={key} className="shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <label
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={selectedDays[key]}
                  onChange={() => handleDayToggle(key)}
                  className="form-check-input"
                />
                <span className="fw-medium">{label}</span>
              </label>

              {selectedDays[key] && (
                <div className="d-flex align-items-center gap-2">
                  {/* Replace the existing TimeSelect with the new TimePicker component */}
                  <TimePicker
                    value={timeSlots[key].from}
                    onChange={(value) => handleTimeChange(key, "from", value)}
                  />
                  <span className="text-muted px-2">to</span>
                  <TimePicker
                    value={timeSlots[key].to}
                    onChange={(value) => handleTimeChange(key, "to", value)}
                  />
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default BusinessHoursSelector;
