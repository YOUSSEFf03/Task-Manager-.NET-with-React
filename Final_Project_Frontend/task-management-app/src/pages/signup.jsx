import react, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import loginImg from '../assets/login-img.jpg';
import { toast } from 'react-toastify';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        
        const newUser = {
            fullName: name,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:5137/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            let data;
            try {
                data = await response.json();
            } catch {
                const text = await response.text();
                throw new Error(text);
            }

            if (!response.ok) {
                setError(data || 'Signup failed');
                return;
            }

            toast.success("Account created! Now login.");
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <section className='login-page'>
            <div className='login-div'>
                <div className='logo'>
                    <Link to="/" className='logo'>
                        Taskly
                    </Link>
                </div>
                <div className='login-header'>
                    <h2>Sign-up</h2>
                    <p>Create an account and start managing your projects!</p>
                </div>
                <form onSubmit={handleSignup} className='login-form'>
                    <div className='input-field'>
                        <label htmlFor='name'>Full Name:</label>
                        <input
                            id='name'
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='input-field'>
                        <label htmlFor='email'>Email</label>
                        <input
                            id='email'
                            type="text"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input-field'>
                        <label htmlFor='password'>Password</label>
                        <input
                            id='password'
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button text={"Create Account"} color='primary' />
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div className='img-side'>
                <img src={loginImg} alt="Side Image" />
            </div>
        </section>
    );
}

export default Signup;