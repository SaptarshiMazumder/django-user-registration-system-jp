import React, { useState, useEffect } from 'react';

function RegistrationForm() {
  // State for the form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    tel: '',
    pref: ''
  });

  const [errors, setErrors] = useState({});
  const [prefs, setPrefs] = useState([{ id: 1, name: 'Tokyo' }, { id: 2, name: 'Osaka' }]);
  const [touched, setTouched] = useState({}); // Track what’s been typed in

  // Grab prefs from the backend
  // useEffect(() => {
  //   async function getPrefs() {
  //     try {
  //       const response = await fetch('http://127.0.0.1:8000/auth/prefs/');
  //       const data = await response.json();
  //       setPrefs(data.prefs);
  //     } catch (err) {
  //       console.log('Couldn’t fetch prefectures:', err);
  //     }
  //   }
  //   getPrefs();
  // }, []);

  // Handle input changes
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true }); // Mark field as touched
    validateField(name, value); // Validate just this field
  };

  // Check errors for a specific field
  const validateField = (field, value) => {
    let newErrors = { ...errors };

    if (field === 'username' && touched.username && value.trim().length < 3) {
      newErrors.username = 'Username needs to be 3 characters or more.';
    } else if (field === 'username') {
      delete newErrors.username;
    }

    if (field === 'email' && touched.email && !/\S+@\S+\.\S+/.test(value)) {
      newErrors.email = 'That’s not a valid email.';
    } else if (field === 'email') {
      delete newErrors.email;
    }

    if (field === 'password' && touched.password) {
      if (value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      } else if (!/[a-z]/.test(value)) {
        newErrors.password = 'Add a lowercase letter.';
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = 'Add an uppercase letter.';
      } else if (!/\d/.test(value)) {
        newErrors.password = 'Add a number.';
      } else {
        delete newErrors.password;
      }
    }

    if (field === 'password_confirm' && touched.password_confirm && value !== formData.password) {
      newErrors.password_confirm = 'Passwords don’t match.';
    } else if (field === 'password_confirm') {
      delete newErrors.password_confirm;
    }

    if (field === 'tel' && touched.tel && value && !/^\d+$/.test(value)) {
      newErrors.tel = 'Phone number should be just numbers.';
    } else if (field === 'tel') {
      delete newErrors.tel;
    }

  

    setErrors(newErrors);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors if they’re empty
    setTouched({
      username: true,
      email: true,
      password: true,
      password_confirm: true,
      tel: true,
      pref: true
    });

    // Run validation on everything
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    // If there’s errors, stop here
    if (Object.keys(errors).length > 0) {
      alert('The form has some errors.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok) {
        alert('You’re registered!');
      } else {
        alert('Something went wrong: ' + JSON.stringify(result.errors));
      }
    } catch (err) {
      console.log('Submit failed:', err);
    }
  };

  return (
    <div>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleFormDataChange}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormDataChange}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleFormDataChange}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="password_confirm">Confirm Password:</label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleFormDataChange}
          />
          {errors.password_confirm && <p style={{ color: 'red' }}>{errors.password_confirm}</p>}
        </div>

        <div>
          <label htmlFor="tel">Telephone:</label>
          <input
            type="text"
            id="tel"
            name="tel"
            value={formData.tel}
            onChange={handleFormDataChange}
          />
          {errors.tel && <p style={{ color: 'red' }}>{errors.tel}</p>}
        </div>

        <div>
          <label htmlFor="pref">Prefecture:</label>
          <select
            id="pref"
            name="pref"
            value={formData.pref}
            onChange={handleFormDataChange}
          >
            <option value="">--Pick one--</option>
            {prefs.map(pref => (
              <option key={pref.id} value={pref.id}>{pref.name}</option>
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
