import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "", 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes for username, email, and password fields
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle form submission and registration process
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null); 

    try {
      // Post the inputs to the server endpoint for registration
      const res = await axios.post("/auth/register", inputs);
      console.log("Registration successful:", res.data);

      // Clear the input fields after successful registration
      setInputs({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Registration error:", err);

      // Handle error response from server, display error message
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading to false once request is done
    }
  }, [inputs]);

  return (
    <div className="auth">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="Username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="Email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="Password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {/* Display error message if exists */}
        {error && <p className="error">{error}</p>}
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
