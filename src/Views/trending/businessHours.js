import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TimeSelect = ({ value, onChange }) => {
  const [hours, setHours] = useState(() => {
    const timeValue = value || "00:00";
    return parseInt(timeValue.split(":")[0]);
  });
  
  const [minutes, setMinutes] = useState(() => {
    const timeValue = value || "00:00";
    return parseInt(timeValue.split(":")[1]);
  });

  const handleHourChange = (delta) => {
    const newHours = (hours + delta + 24) % 24;
    setHours(newHours);
    onChange(`${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  const handleMinuteChange = (delta) => {
    const newMinutes = (minutes + delta + 60) % 60;
    setMinutes(newMinutes);
    onChange(`${hours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`);
  };

  return (
    <div className="d-flex align-items-center gap-1 border rounded px-2 py-1">
      <div className="d-flex flex-column align-items-center">
        <button type="button" onClick={() => handleHourChange(1)} className="btn btn-link p-1">
          <ChevronUp size={16} />
        </button>
        <span className="small w-6 text-center">{hours.toString().padStart(2, '0')}</span>
        <button type="button" onClick={() => handleHourChange(-1)} className="btn btn-link p-1">
          <ChevronDown size={16} />
        </button>
      </div>

      <span className="small">:</span>

      <div className="d-flex flex-column align-items-center">
        <button type="button" onClick={() => handleMinuteChange(1)} className="btn btn-link p-1">
          <ChevronUp size={16} />
        </button>
        <span className="small w-6 text-center">{minutes.toString().padStart(2, '0')}</span>
        <button type="button" onClick={() => handleMinuteChange(-1)} className="btn btn-link p-1">
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

const BusinessHoursSelector = ({ selectedDays, setSelectedDays, timeSlots, setTimeSlots, days }) => {
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
              <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
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
                  <TimeSelect
                    value={timeSlots[key].from}
                    onChange={(value) => handleTimeChange(key, "from", value)}
                  />
                  <span className="text-muted px-2">to</span>
                  <TimeSelect
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