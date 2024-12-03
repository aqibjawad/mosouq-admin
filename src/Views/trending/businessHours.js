import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

import "./timePicker.css";

const TimePicker = ({ value, onChange }) => {
  const [hour, setHour] = useState(() => value?.split(":")[0] || "12");
  const [minute, setMinute] = useState(
    () => value?.split(":")[1]?.split(" ")[0] || "00"
  );
  const [period, setPeriod] = useState(() => value?.split(" ")[1] || "AM");

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  useEffect(() => {
    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const formattedTime = `${h.toString().padStart(2, "0")}:${minute}`;
    onChange(formattedTime);
  }, [hour, minute, period, onChange]);

  return (
    <div className="time-picker">
      <div className="picker-container">
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

const BusinessHoursSelector = ({
  selectedDays,
  setSelectedDays,
  timeSlots,
  setTimeSlots,
  days,
  onChange,
}) => {
  useEffect(() => {
    const businesshours = Object.keys(selectedDays)
      .filter(
        (day) => selectedDays[day] && timeSlots[day].from && timeSlots[day].to
      )
      .map((day) => ({
        day,
        fromTime: timeSlots[day].from,
        toTime: timeSlots[day].to,
      }));

    if (onChange) {
      onChange(businesshours);
    }
  }, [selectedDays, timeSlots, onChange]);

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
