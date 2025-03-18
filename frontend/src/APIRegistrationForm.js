import React, { useState, useEffect } from 'react';

function APIRegistrationForm() {
  // Form stuff
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    tel: '',
    pref: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [prefs, setPrefs] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Get the prefectures when the page loads
  useEffect(() => {
    async function getPrefs() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/prefs/');
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

    if (name === 'username' && touched.username && value.trim().length < 3) {
      newErrors.username = 'ユーザー名は3文字以上である必要があります。';
    } else if (name === 'username') {
      delete newErrors.username;
    }

    if (name === 'email' && touched.email && !/\S+@\S+\.\S+/.test(value)) {
      newErrors.email = '有効なメールアドレスではありません。';
    } else if (name === 'email') {
      delete newErrors.email;
    }

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

    if (name === 'password_confirm' && touched.password_confirm && value !== formData.password) {
      newErrors.password_confirm = 'パスワードが一致しません。';
    } else if (name === 'password_confirm') {
      delete newErrors.password_confirm;
    }

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

    // Mark everything as touched to show errors
    setTouched({
      username: true,
      email: true,
      password: true,
      password_confirm: true,
      tel: true,
      pref: true
    });

    // Validate all fields
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    // Stop if there’s errors
    if (Object.keys(errors).length > 0) {
      setErrMsg('フォームにエラーがあります。');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMsg('登録が完了しました！');
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
        setErrMsg('エラーが発生しました: ' + JSON.stringify(errorData));
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
