import React, { useRef, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { POST } from "../../apicontroller/ApiController";

const Signup = () => {
  
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    // Add more validation rules as needed

    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setErrors(validatePassword(newPassword));
  };

  const navigation = useNavigate();

  const [passError, setPassError] = useState(false);

  const matchPass = (confirm, password) => {
    if (confirm.length !== 0 || password.length !== 0) {
      if (password === confirm) {
        setPassError(false);
      } else {
        setPassError(true);
      }
    } else {
      setPassError(true);
    }
  };

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const submit = async (event) => {
    event.preventDefault();
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: "admin",
    };
    POST("user/add-user", formData).then((res) => {
      toast("Your Account Added Successfully");
      navigation("/");
    });
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: "#CADDFE",
        height: "100vh", // Set the height to 100vh for full viewport height
        width: "100vw",  // Set the width to 100vw for full viewport width
      }}
    >
      <Card
        className="border-0"
        style={{
          width: "400px",   // Set the desired width
          height: "500px",  // Set the desired height
          marginTop: "2rem",
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        <Card.Body style={{ padding: "20px" }}>
          <div className="container">
            {/* <img
              src="/logos/souk center-logos.jpeg"
              alt="Logo"
              style={{
                marginBottom: "5px",
                marginLeft: "75px",
                maxWidth: "130px",
                maxHeight: "75px",
                borderRadius: 50,
                display: "inline-block",
              }}
            /> */}
            <p
              style={{
                fontFamily: "serif",
                fontWeight: "700",
                fontSize: "23px",
                textAlign: "center",
                color: "#233D7B",
              }}
            >
              LWBC
            </p>
          </div>
          <Card.Title
            style={{
              color: "#233D7B",
              fontWeight: "700",
              fontSize: "24px",
              fontFamily: "serif",
            }}
          >
            Sign Up
          </Card.Title>
          {/* <div>
            <Button
              className="border-0"
              style={{
                width: "350px",
                backgroundColor: "#405A94",
                marginTop: "10px",
              }}
            >
              Continue with Microsoft
            </Button>
          </div> */}
          <Form onSubmit={submit}>
            <Form.Group
              className="mb-3"
              controlId="formBasicName"
              style={{
                width: "350px",
                marginTop: "15px",
                fontFamily: "serif",
                fontWeight: "normal",
              }}
            >
              <Form.Control
                type="text"
                placeholder="First Name"
                ref={nameRef}
                required
                style={{
                  width: "350px",
                  fontFamily: "serif",
                  fontWeight: "normal",
                  background: "#E6E6E6",
                }}
              />
            </Form.Group>
            

            <Form.Group
              className="mb-3"
              controlId="formBasicEamil"
              style={{
                width: "350px",
                fontFamily: "serif",
                fontWeight: "normal",
              }}
            >
              <Form.Control
                type="email"
                placeholder="Email"
                ref={emailRef}
                required
                style={{
                  width: "350px",
                  fontFamily: "serif",
                  fontWeight: "normal",
                  background: "#E6E6E6",
                }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicPassword"
              style={{
                width: "350px",
                fontFamily: "serif",
                fontWeight: "normal",
              }}
            >
              <Form.Control
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
                style={{
                  width: "350px",
                  fontFamily: "serif",
                  fontWeight: "normal",
                  background: "#E6E6E6",
                }}
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            {errors.length > 0 && (
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <Form.Group
              className="mb-3"
              controlId="formBasicConfirmPassword"
              style={{
                width: "350px",
                fontFamily: "serif",
                fontWeight: "normal",
              }}
            >
              <Form.Control
                onChange={(e) =>
                  matchPass(e.target.value, passwordRef.current.value)
                }
                type="password"
                placeholder="Confirm Password"
                required
                style={{
                  width: "350px",
                  fontFamily: "serif",
                  fontWeight: "normal",
                  background: "#E6E6E6",
                }}
              />
              {passError && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontFamily: "serif",
                    fontWeight: "normal",
                  }}
                  className="text-danger"
                >
                  Both passwords don't match
                </span>
              )}
            </Form.Group>
            <Button
              onClick={submit}
              className="border-0"
              type="submit"
              style={{
                width: "350px",
                backgroundColor: "#233D7B",
                fontFamily: "serif",
                fontWeight: "normal",
              }}
            >
              Create Account
            </Button>
            
            <p
              style={{
                fontSize: "14px",
                float: "right",
                fontFamily: "serif",
                fontWeight: "normal",
              }}
            >
              Back To
              <Link
                to="/"
                style={{
                  fontSize: "14px",
                  float: "right",
                  color: "blue",
                  fontFamily: "serif",
                  fontWeight: "normal",
                }}
              >
                Sign In
              </Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
