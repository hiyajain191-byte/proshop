import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import Loader from '../../components/loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  // GET USER DETAILS
  const {
    data: user,
    isLoading,
    error,
  } = useGetUserDetailsQuery(userId);

  // UPDATE USER
  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation();

  // Fill form when data loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setIsAdmin(Boolean(user.isAdmin));
    }
  }, [user]);

  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser({
        _id: userId,
        name,
        email,
        isAdmin: Boolean(isAdmin),
      }).unwrap();

      setSuccessMessage('User updated successfully ✅');

      setTimeout(() => {
        navigate('/admin/userlist');
      }, 1000);
    } catch (err) {
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>

        {successMessage && (
          <Message variant='success'>{successMessage}</Message>
        )}

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            
            {/* NAME */}
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* ADMIN CHECKBOX */}
            <Form.Group className='my-3' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              disabled={loadingUpdate}
            >
              {loadingUpdate ? 'Updating...' : 'Update'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;