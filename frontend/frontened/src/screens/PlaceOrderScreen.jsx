import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/loader';
import CheckoutSteps from '../components/CheckoutSteps';

import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCart } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // 🔥 SAFE CALCULATIONS
  const itemsPrice = cart.cartItems.reduce(
    (acc, item) =>
      acc + Number(item.qty || 0) * Number(item.price || 0),
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));

  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  // 🔥 SAFER REDIRECT CHECKS
  useEffect(() => {
    if (!cart.shippingAddress || !cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  // 🔥 PLACE ORDER HANDLER (FIXED)
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          qty: Number(item.qty),
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCart());

      toast.success('Order Placed Successfully');

      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Order failed');
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{' '}
                {cart.shippingAddress?.postalCode},{' '}
                {cart.shippingAddress?.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item.product}>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant='danger'>
                    {error?.data?.message || 'Something went wrong'}
                  </Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type='button'
                  className='w-100'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>

                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;