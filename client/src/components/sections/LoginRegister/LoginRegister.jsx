import React, { useState } from 'react';
import { userRegister, userLogin } from "../../../api/backendApi.js";
import "./LoginRegister.scss";

import { IoMdLogIn } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showForm, setShowForm] = useState("login");

  let navigate = useNavigate()

  // register form
  const [registerFormData, setRegisterFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleRegisterFormChange = (e) => {
    let { name, value } = e.target

    setRegisterFormData(prev => {
      return {
        ...prev, [name]: value
      }
    })
  }

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = registerFormData;

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await userRegister(registerFormData);
      alert(result.message);
      setShowForm("login");
    } catch (error) {
      console.log("error while registering : ", error)
      alert(error);
    }
  };

  // login form

  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const handleLoginFormChange = (e) => {
    let { name, value } = e.target

    setLoginData(prev => {
      return {
        ...prev, [name]: value
      }
    })
  }

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    try {
      const result = await userLogin(loginData); // Call backend
      alert(result.message || "Login successful!");
      localStorage.setItem("token", result.token)
      // You can redirect or update UI here (e.g., navigate to dashboard)
      // Example:
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message || error); // Show user-friendly error
    }
  };

  return (
    <div id='login-register-container'>
      {/* Login Form */}
      <div className='form login-form flex flex-col justify-center gap-10'>
        <div className=''>
          <span className='font-bold text-2xl'>Please Login</span>
        </div>
        <div className='py-6'>
          <form onSubmit={handleLoginFormSubmit} className='flex flex-col gap-10'>
            <div className='flex flex-col gap-4'>
              <div className='flex-1 flex flex-col gap-2'>
                <label htmlFor="login-email">Please Enter Email</label>
                <input
                  onChange={handleLoginFormChange}
                  name='email'
                  value={loginData.email}
                  type="email"
                  id="login-email"
                  placeholder='Email' />
              </div>
              <div className='flex-1 flex flex-col gap-2'>
                <label htmlFor="login-password">Please Enter Password</label>
                <div className='flex'>
                  <input
                    onChange={handleLoginFormChange}
                    name='password'
                    value={loginData.password}
                    className='flex-1'
                    id="login-password"
                    type={!showPassword ? "password" : "text"}
                    placeholder='Password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='bg-highlightColor p-3'
                  >
                    {!showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>
            <div className='flex gap-3 flex-wrap justify-center'>
              <button type='submit' className='bg-white text-primaryColor font-bold py-2 px-4'>Login</button>
              <button type='reset' className='bg-white text-primaryColor font-bold py-2 px-4'>Reset</button>
              <div onClick={() => setShowForm("register")} className='w-full cursor-pointer text-center'>
                <span className='flex-1'>
                  Haven't Registered? <span className='font-bold text-highlightColor'>Please Register First</span>.
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Register Form */}
      <div className='form register-form flex flex-col justify-center gap-10'>
        <div className=''>
          <span className='font-bold text-2xl'>Please Register</span>
        </div>
        <div className='py-6'>
          <form onSubmit={handleRegisterFormSubmit} className='flex flex-col gap-10'>
            <div className='flex flex-col gap-4'>
              <div className='flex-1 flex flex-col gap-2'>
                <label htmlFor="register-name">Full Name</label>
                <input
                  onChange={handleRegisterFormChange}
                  name='fullName'
                  value={registerFormData.fullName}
                  type="text" id="register-name" placeholder='Full Name' />
              </div>
              <div className='flex-1 flex flex-col gap-2'>
                <label htmlFor="register-email">Email</label>
                <input
                  onChange={handleRegisterFormChange}
                  name='email'
                  value={registerFormData.email}
                  type="email" id="register-email" placeholder='Email' />
              </div>
              <div className='flex-1 flex flex-col gap-2 relative'>
                <label htmlFor="register-password">Password</label>
                <div
                  className='flex'
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                >
                  <input
                    onChange={handleRegisterFormChange}
                    name='password'
                    value={registerFormData.password}
                    className='flex-1'
                    id="register-password"
                    type={!showPassword ? "password" : "text"}
                    placeholder='Password'
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                    title="Password must be at least 8 characters, include uppercase, lowercase, number, and symbol."
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='bg-highlightColor p-3'
                  >
                    {!showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {showTooltip && (
                  <div className="password-tooltip">
                    <span className='font-semibold text-primaryColor'>Password must contain:</span>
                    <ul className='list-disc list-inside text-sm text-gray-100 mt-2'>
                      <li>At least 8 characters</li>
                      <li>1 uppercase & 1 lowercase letter</li>
                      <li>1 number</li>
                      <li>1 special character (@$!%*?&)</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className='flex-1 flex flex-col gap-2'>
                <label htmlFor="register-confirm-password">Confirm Password</label>
                <div className='flex'>
                  <input
                    onChange={handleRegisterFormChange}
                    name='confirmPassword'
                    value={registerFormData.confirmPassword}
                    className='flex-1'
                    id="register-confirm-password"
                    type={!showConfirmPassword ? "password" : "text"}
                    placeholder='Confirm Password'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='bg-highlightColor p-3'
                  >
                    {!showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>
            <div className='flex gap-3 flex-wrap justify-center'>
              <button type='submit' className='bg-white text-primaryColor font-bold py-2 px-4'>Register</button>
              <button type='reset' onClick={() => {
                setRegisterFormData(
                  {
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  })
              }} className='bg-white text-primaryColor font-bold py-2 px-4'>Reset</button>
              <div onClick={() => setShowForm("login")} className='w-full cursor-pointer text-center'>
                <span className='flex-1'>
                  Already Registered? <span className='font-bold text-highlightColor'>Please Login</span>.
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Toggle Slider Panel */}
      <div
        className='toggle-slider'
        style={{
          left: `${showForm === "login" ? "50%" : "0"}`
        }}
      >
        <div className='h-full flex items-center justify-center flex-col gap-5 p-10'>
          <span className='text-backgroundLight text-3xl font-bold'>Web Application</span>
          <span className='text-backgroundLight font-semibold'>for Reinforcement Learning</span>
          <span className='text-gray-300'>personalised learning | data logging</span>
          <div
            onClick={() => { setShowForm(!showForm) }}
            className='bg-backgroundLight text-primaryColor hover:bg-backgroundDark hover:text-highlightColor transition-all font-semibold p-3 rounded-full flex gap-3 items-center justify-center'>
            <IoMdLogIn size={25} />
            <span>Please Login / Register to Start</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;