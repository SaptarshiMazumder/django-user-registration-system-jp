import React, {useState, useEffect} from 'react';

function APIRegistrationForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        tel: '',
        pref: '',
    })
    const [successMsg, setSuccessMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [prefs, setPrefs] = useState([])
    useEffect(() => {
        const fetchPrefectures = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/auth/prefs/');
            const data = await response.json();
            setPrefs(data);
        
        }
        fetchPrefectures();
    }, []);
    const handleFormDataChange = (e) => {
                const {name, value} = e.target;
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        const handleSubmit = async (e) => {
            e.preventDefault();
            setSuccessMsg('');
            setErrMsg('');

            const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccessMsg('User registered successfully');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    password_confirm: '',
                    tel: '',
                    pref: '',
                });
            } else {
                try {
                    const errorData = await response.json();
                    setErrMsg(JSON.stringify(errorData));
                } catch (error) {
                    setErrMsg('An error occurred during registration.');
                }
            }
        }

    return (
        <div>
            <h1>API Registration Form</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleFormDataChange} required />
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormDataChange} required />
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleFormDataChange} required />
                <label>Confirm Password</label>
                <input type="password" name="password_confirm" value={formData.password_confirm} onChange={handleFormDataChange} required />
                <label>Telephone</label>
                <input type="tel" name="tel" value={formData.tel} onChange={handleFormDataChange}  />
                <label>Prefecture</label>
                <select name="pref" value={formData.pref} onChange={handleFormDataChange}>
                    <option value="option1">Select Prefecture</option>
                    {prefs.map(pref => <option key={pref.id} value={pref.id}>{pref.name}</option>)}
                    
                </select>
                <button type="submit">Register</button>
            </form>
            <p>{successMsg}</p>
            <p>{errMsg}</p>
        </div>
    );

    
}

export default APIRegistrationForm;
