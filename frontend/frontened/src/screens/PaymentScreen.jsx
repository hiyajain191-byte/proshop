import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // 🔴 Protect route: must have shipping
  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Save payment method in redux + localStorage
    dispatch(savePaymentMethod(paymentMethod));

    // ✅ MOVE TO NEXT STEP (PLACE ORDER SCREEN)
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      {/* Checkout Progress */}
      <CheckoutSteps step1 step2 step3 />

      <h1>Payment Method</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>

          <Col>
            {/* PayPal */}
            <Form.Check
              className="my-2"
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

   
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;