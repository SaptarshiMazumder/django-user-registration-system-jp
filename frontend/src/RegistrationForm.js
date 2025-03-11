// frontend/src/RegistrationForm.js

import React, { useState, useEffect } from 'react';

function RegistrationForm() {
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    tel: '',
    pref: null,
  });
  // Error messages
  const [errors, setErrors] = useState({});
  const [prefectures, setPrefectures] = useState([]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/prefectures/');
        const data = await response.json();
        console.log('Prefectures:', data.prefectures);
        setPrefectures(data.prefectures);
      } catch (error) {
        console.error('Error fetching prefectures:', error);
      }
    };

    fetchPrefectures();
  }, []);

  useEffect(() => {
  }, [formData]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Only submit if no client-side errors
  if (Object.keys(errors).length === 0) {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // formData includes username, email, etc.
      });
      const result = await response.json();

      if (response.ok) {
        // 201 Created => success
        alert('Registered successfully!');
      } else {
        // 400 => form validation errors
        console.log('Errors from Django:', result.errors);
        // You could display these errors in the UI if you like
        alert('Registration failed: ' + JSON.stringify(result.errors));
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  } else {
    alert('Please fix the errors before submitting.');
  }
};

  return (
    <div>
      <h1>React Registration Form</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange} 
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange} 
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange} 
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password" 
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange} 
          />
          {errors.password_confirm && <p style={{ color: 'red' }}>{errors.password_confirm}</p>}
        </div>
        
        <div>
          <label>Telephone:</label>
          <input 
            type="text" 
            name="tel"
            value={formData.tel}
            onChange={handleChange} 
          />
          {errors.tel && <p style={{ color: 'red' }}>{errors.tel}</p>}
        </div>
        
        <div>
          <label>Prefecture:</label>
          <select 
            name="pref"
            value={formData.pref}
            onChange={handleChange}
          >
            <option value="">--Select Prefecture--</option>
            {prefectures.map((pref) => (
              <option key={pref.id} value={pref.id}>
                {pref.name}
              </option>
            ))}
          </select>
          {errors.pref && <p style={{ color: 'red' }}>{errors.pref}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
