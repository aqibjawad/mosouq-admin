import React, { useRef, useState, useEffect } from "react";
import "./index.css";
import { Auth } from "../../context/Auth.Context";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const auth = Auth();
  const [isLoading, setIsLoading] = useState(false);

  const otpCodeRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  let navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setStep(1);
    }
  }, []);

  // const submit = async (e) => {
  //   e.preventDefault();
  //   if (!emailRef.current.value || !passwordRef.current.value) {
  //     toast.error("Please fill in all fields.");
  //     return;
  //   }

  //   try {
  //     const formData = {
  //       email: emailRef.current.value,
  //       password: passwordRef.current.value,
  //     };
  //     const result = await axios.post(
  //       `http://localhost:5000/api/user/login-admin`,
  //       formData
  //     );

  //     setEmail(emailRef.current.value);
  //     localStorage.setItem("userEmail", emailRef.current.value);
  //     toast.success("Login successful! Please verify OTP.");
  //     setStep(2);
  //     navigate("/dashboard");

  //   } catch (error) {
  //     console.log(error);
  //     toast.error(
  //       error.response?.data?.error || "Login failed. Please try again."
  //     );
  //   }
  // };

  // const handleOtpCodeSubmit = async (e) => {
  //   e.preventDefault();
  //   const otpCodeValue = otpCode.join("");
  //   if (otpCodeValue.length === 6) {
  //     try {
  //       const data = {
  //         otp: otpCodeValue,
  //         email: email,
  //       };

  //       const result = await axios.post(
  //         `http://localhost:5000/api/user/verify-login-otp`,
  //         data
  //       );

  //       const { token, user } = result.data;

  //       localStorage.setItem("token", token);
  //       auth.activateToken(token);

  //       if (user) {
  //         localStorage.setItem("user", JSON.stringify(user));
  //       }

  //       auth.activateAuthentication(true);

  //       toast.success("OTP verified successfully! Redirecting to dashboard...");
  //       navigate("/dashboard");

  //     } catch (error) {
  //       console.log("Error:", error.response?.data);
  //       toast.error(
  //         error.response?.data?.message ||
  //         "Failed to verify OTP. Please try again."
  //       );
  //     }
  //   } else {
  //     toast.error("Please enter a valid 6-digit OTP code.");
  //   }
  // };

  const submit = async (e) => {
    e.preventDefault();
    let check = 0;
    // Form Validators - Empty Check
    emailRef.current.value.length === 0 && check++;
    passwordRef.current.value.length === 0 && check++;
    // Form Validators - Empty Check
    if (check > 0) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const formData = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      const result = await axios.post(
        `https://apis.mosouq.ae/api/user/login-admin`,
        formData
      );
      if (check === 0) {
        // Successful Login
        auth.activateToken(localStorage.setItem("token", result.data.token));
        console.log(auth.activateToken);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        auth.activateAuthentication(true);
        toast.success("Login Successful");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Login failed. Please try again later.");
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading whether success or error
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^[0-9]$/)) {
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);
      if (index < otpCodeRefs.length - 1) {
        otpCodeRefs[index + 1].current.focus();
      }
    } else if (value === "") {
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otpCode[index] === "") {
      if (index > 0) {
        otpCodeRefs[index - 1].current.focus();
      }
    }
  };

  return (
    <div className="signin-container">
      <div className="signin">
        <div className="sign-header mb-5">Login Mosouq</div>
        {step === 1 && (
          <form onSubmit={submit}>
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Email Address"
            />
            <input
              ref={passwordRef}
              type="password"
              name="password"
              placeholder="Password"
            />
            <button
              type="submit"
              className="signin-button"
              style={{ marginTop: "2rem" }}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>
        )}

        {/* {step === 2 && (
          <form onSubmit={handleOtpCodeSubmit}>
            <div className="otp-code-inputs">
              {otpCodeRefs.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="text"
                  name={`otp-code-${index}`}
                  value={otpCode[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  maxLength="1"
                  className="otp-code-input"
                />
              ))}
            </div>
            <button
              type="submit"
              className="signin-button"
              style={{ marginTop: "2rem" }}
            >
              Verify OTP
            </button>
          </form>
        )} */}
      </div>
    </div>
  );
};

export default Login;
