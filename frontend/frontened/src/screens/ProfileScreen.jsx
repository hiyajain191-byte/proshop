import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/loader';

import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';

import { setCredentials } from '../slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setName(userInfo.name || '');
    setEmail(userInfo.email || '');
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updateProfile({
        name,
        email,
        password: password ? password : undefined,
      }).unwrap();

      dispatch(setCredentials(res));

      toast.success('Profile updated successfully');

      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row>
      {/* LEFT: PROFILE */}
      <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>

          <Form.Group className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loadingUpdateProfile}
          >
            Update
          </Button>

          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>

      {/* RIGHT: ORDERS */}
      <Col md={9}>
        <h2>My Orders</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {[...orders]
                .slice(-5)
                .reverse()
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>

                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>

                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>

                    <td>
                      <Button
                        as={Link}
                        to={`/order/${order._id}`}
                        size="sm"
                        variant="light"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;