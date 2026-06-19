      import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import {
  PayPalButtons,
  PayPalScriptProvider,
} from '@paypal/react-paypal-js';

import Message from '../components/Message';
import Loader from '../components/loader';

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] =
    usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { data: paypal, isLoading: loadingPayPal } =
    useGetPaypalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [orderId, refetch]);

  // ✅ DELIVERY
  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();

      alert('Order Delivered Successfully');

      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Delivery Failed');
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
      {error?.data?.message || error.error}
    </Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>

      <Row>

        {/* LEFT SIDE */}
        <Col md={8}>
          <ListGroup variant="flush">

            {/* SHIPPING */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            {/* PAYMENT STATUS */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>{order.paymentMethod}</p>

              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            {/* ITEMS */}
            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} fluid rounded />
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
            </ListGroup.Item>

          </ListGroup>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">

              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                Items: ${order.itemsPrice}
              </ListGroup.Item>

              <ListGroup.Item>
                Shipping: ${order.shippingPrice}
              </ListGroup.Item>

              <ListGroup.Item>
                Tax: ${order.taxPrice}
              </ListGroup.Item>

              <ListGroup.Item>
                <strong>Total: ${order.totalPrice}</strong>
              </ListGroup.Item>

              {/* PAYPAL */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay || loadingPayPal || !paypal?.clientId ? (
                    <Loader />
                  ) : (
                    <PayPalScriptProvider
                      options={{
                        'client-id': paypal.clientId,
                        currency: 'USD',
                        intent: 'capture',
                      }}
                    >
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: Number(order.totalPrice).toFixed(2),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();

                          try {
                            await payOrder({
                              orderId,
                              details,
                            }).unwrap();

                            alert('Payment Successful');
                            refetch();
                          } catch (err) {
                            alert('Payment Failed');
                          }
                        }}
                        onError={() => {
                          alert('PayPal Error');
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              )}

              {/* PAY LATER */}
              {!order.isPaid && (
                <ListGroup.Item>
                  <button
                    className="btn btn-warning w-100"
                    onClick={async () => {
                      try {
                        await payOrder({
                          orderId,
                          details: {
                            id: 'pay-later',
                            status: 'PENDING',
                            update_time: new Date().toISOString(),
                            payer: {
                              email_address: order.user.email,
                            },
                          },
                        }).unwrap();

                        alert('Marked as Pay Later');
                        refetch();
                      } catch (err) {
                        alert('Failed');
                      }
                    }}
                  >
                    Pay Later
                  </button>
                </ListGroup.Item>
              )}

              {/* ADMIN DELIVER */}
              {userInfo?.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <Loader />}

                    <button
                      className="btn btn-primary w-100"
                      disabled={loadingDeliver}
                      onClick={deliverHandler}
                    >
                      {loadingDeliver
                        ? 'Updating...'
                        : 'Mark As Delivered'}
                    </button>
                  </ListGroup.Item>
                )}

            </ListGroup>
          </Card>
        </Col>

      </Row>
    </>
  );
};

export default OrderScreen;