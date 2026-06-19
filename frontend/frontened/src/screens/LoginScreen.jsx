import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 GET REDIRECT FROM URL
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { userInfo } = useSelector((state) => state.auth);

  const [login, { isLoading }] = useLoginMutation();

  // 🔥 AUTO REDIRECT AFTER LOGIN
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();

      console.log('LOGIN RESPONSE:', res);

      // store user in redux + localStorage
      dispatch(setCredentials(res));

      alert('Login successful');

      // ❌ DO NOT navigate here manually
      // navigate(redirect) REMOVED ON PURPOSE

    } catch (err) {
      console.log('LOGIN ERROR:', err);
      alert(err?.data?.message || 'Login failed');
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-100"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* REGISTER LINK */}
        <div className="py-3 text-center">
          New Customer? <Link to="/register">Register</Link>
        </div>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;