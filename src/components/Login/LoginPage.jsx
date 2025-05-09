import './LoginPage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../../assets/Amrita_logo.png';
import bgImage from '../../assets/eoc_proj.jpg';

function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: {
      role: 'user',
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().min(4, 'Minimum 4 characters').required('Password is required')
    }),
    onSubmit: (values) => {
      toast.success(`Logging in as ${values.role.toUpperCase()} 👏`, {
        position: 'top-center',
        autoClose: 2000,
      });

      setTimeout(() => {
        if (values.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }, 2500);
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark' : ''}`}>
      <ToastContainer />
      <div className="left-panel" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="left-panel-content">
          <img src={logo} alt="Amrita Logo" className="amrita-logo" />
          <h1>AI-Enhanced Canteen Management</h1>
        </div>
      </div>

      <div className="right-panel">
        <motion.form
          className="login-form"
          onSubmit={formik.handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Welcome Back</h2>

          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
          >
            <option value="user">👤 Login as User</option>
            <option value="admin">🛠️ Login as Admin</option>
          </select>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="error">{formik.errors.username}</div>
          ) : null}

          <div className="password-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}

          <button type="submit">🚀 Login</button>
        </motion.form>
      </div>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
}

export default LoginPage;
