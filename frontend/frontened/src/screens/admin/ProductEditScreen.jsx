import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import Message from '../../components/Message';
import Loader from '../../components/loader';
import FormContainer from '../../components/FormContainer';

import { toast } from 'react-toastify';

import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../slices/productapiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  // Fill form
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || 0);
      setBrand(product.brand || '');
      setCountInStock(product.countInStock || 0);
      setCategory(product.category || '');
      setDescription(product.description || '');
      setImage(product.image || '');
    }
  }, [product]);

  // IMAGE UPLOAD
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      setImage(data.image);

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // SUBMIT PRODUCT UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        productId,
        name,
        price: Number(price),
        brand,
        countInStock: Number(countInStock),
        category,
        description,
        image,
      }).unwrap();

      toast.success('Product updated successfully');

      setTimeout(() => {
        navigate('/admin/productlist');
      }, 500);

      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error?.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            {/* NAME */}
            <Form.Group className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* PRICE */}
            <Form.Group className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Form.Group>

            {/* BRAND */}
            <Form.Group className='my-2'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            {/* STOCK */}
            <Form.Group className='my-2'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
              />
            </Form.Group>

            {/* CATEGORY */}
            <Form.Group className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            {/* DESCRIPTION */}
            <Form.Group className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* IMAGE URL */}
            <Form.Group className='my-2'>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Group>

            {/* IMAGE UPLOAD */}
            <Form.Group className='my-2'>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type='file' onChange={uploadFileHandler} />
            </Form.Group>

            {uploading && <Loader />}

            <Button type='submit' variant='primary' className='my-3'>
              Update Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;