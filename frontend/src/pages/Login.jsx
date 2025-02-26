import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();  // ❌ Removed `user` (won't be updated instantly)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
  
      console.log("User Data After Login:", userData); // ✅ Debug the user object
  
      if (!userData || !userData.role) {
        console.error("User is null or role is undefined after login!");
        return;
      }
  
      navigate(userData.role === 'admin' ? '/admin' : '/user');  
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
