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

  // Run validation each time formData changes
  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    // 1. username: minimum 3 characters
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    }

    // 2. email: must be valid format & not duplicate
    // (We simulate a duplicate check by disallowing "duplicate@example.com")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (formData.email === 'duplicate@example.com') {
      newErrors.email = 'This email is already registered.';
    }

    // 3. password: >=8 chars, uppercase, lowercase, digit
    const password = formData.password;
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must include an uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must include a lowercase letter.';
    }
    if (!/\d/.test(password)) {
      newErrors.password = 'Password must include a digit.';
    }

    // 4. confirm password
    if (password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match.';
    }

    // 5. tel: digits only (if provided)
    if (formData.tel && !/^\d+$/.test(formData.tel)) {
      newErrors.tel = 'Telephone number must contain digits only.';
    }


    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  validateForm(); // client-side validation

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
