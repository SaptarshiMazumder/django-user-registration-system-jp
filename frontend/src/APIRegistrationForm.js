import React, { useState, useEffect } from 'react';
import { API_PREFECTURES_URL, API_REGISTER_URL } from './config';
import './form.css';

function APIRegistrationForm() {
  // State to store form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    tel: null,
    pref: ''
  });
    // State for success and error messages

  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // State for list of prefectures (loaded from API)
  const [prefs, setPrefs] = useState([]);
  // State for validation errors and tracking touched fields
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Get the prefectures when the page loads
  useEffect(() => {
    async function getPrefs() {
      try {
        const response = await fetch(API_PREFECTURES_URL);
        const data = await response.json();
        setPrefs(data);
      } catch (err) {
        console.log('Couldn’t fetch prefectures:', err);
      }
    }
    getPrefs();
  }, []);

  // Update form data when typing
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true }); // Mark as touched
    validateField(name, value); // Check this field
  };

  // Validate a single field
  const validateField = (name, value) => {
    let newErrors = { ...errors };


    // Username validation (at least 3 characters)

    if (name === 'username' && touched.username && value.trim().length < 3) {
      newErrors.username = 'ユーザー名は3文字以上である必要があります。';
    } else if (name === 'username') {
      delete newErrors.username;
    }

    // Email validation (basic format check)

    if (name === 'email' && touched.email && !/\S+@\S+\.\S+/.test(value)) {
      newErrors.email = '有効なメールアドレスではありません。';
    } else if (name === 'email') {
      delete newErrors.email;
    }

    // Password validation (8+ chars, includes uppercase lowercase  number)

    if (name === 'password' && touched.password) {
      if (value.length < 8) {
        newErrors.password = 'パスワードは8文字以上である必要があります。';
      } else if (!/[a-z]/.test(value)) {
        newErrors.password = '小文字を入力してください。';
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = '大文字も必要です。';
      } else if (!/\d/.test(value)) {
        newErrors.password = '数字を追加してください。';
      } else {
        delete newErrors.password;
      }
    }

        // Confirm password confirm matches password

    if (name === 'password_confirm' && touched.password_confirm && value !== formData.password) {
      newErrors.password_confirm = 'パスワードが一致しません。';
    } else if (name === 'password_confirm') {
      delete newErrors.password_confirm;
    }

        // Telephone number is only nums

    if (name === 'tel' && touched.tel && value && !/^\d+$/.test(value)) {
      newErrors.tel = '電話番号は数字のみで入力してください。';
    } else if (name === 'tel') {
      delete newErrors.tel;
    }

  

    setErrors(newErrors);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

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

    // If there are errors, prevent submission
    if (Object.keys(errors).length > 0) {
      setErrMsg('フォームにエラーがあります。');
      return;
    }

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMsg('登録が完了しました！');
        // Reset form after successful submission
        setFormData({
          username: '',
          email: '',
          password: '',
          password_confirm: '',
          tel: '',
          pref: ''
        });
      } else {
        const errorData = await response.json();
        let errorMessages = '';
        for (const field in errorData) {
          errorMessages += errorData[field].join(', ') + '\n ';
        }
        setErrMsg('エラーが発生しました: ' + errorMessages);
      }
    } catch (err) {
      setErrMsg('サーバーで問題が発生しました。');
      console.log('Submit error:', err);
    }
  };

  return (
    <div>
      <h1>API登録フォーム</h1>
      <p>これはDjango Rest APIのフロントエンドです。</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザー名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFormDataChange}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>

        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormDataChange}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label>パスワード</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormDataChange}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <label>パスワード確認</label>
          <input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleFormDataChange}
          />
          {errors.password_confirm && <p style={{ color: 'red' }}>{errors.password_confirm}</p>}
        </div>

        <div>
          <label>電話番号</label>
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleFormDataChange}
          />
          {errors.tel && <p style={{ color: 'red' }}>{errors.tel}</p>}
        </div>

        <div>
          <label>都道府県</label>
          <select name="pref" value={formData.pref} onChange={handleFormDataChange}>
            <option value="">-- 選択してください --</option>
            {prefs.map(pref => (
              <option key={pref.id} value={pref.id}>{pref.name}</option>
            ))}
          </select>
          {errors.pref && <p style={{ color: 'red' }}>{errors.pref}</p>}
        </div>

        <button type="submit">登録</button>
      </form>
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
    </div>
  );
}

export default APIRegistrationForm;
