import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/ordermodel.js';
import Product from '../models/productmodel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Get products from DB
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x.product) },
  });

  // Map items with DB data
  const dbOrderItems = orderItems.map((item) => {
    const match = itemsFromDB.find(
      (p) => p._id.toString() === item.product
    );

    return {
      product: item.product,
      name: match?.name,
      image: match?.image,
      price: match?.price,
      qty: item.qty,
    };
  });

  // Calculate prices
  const itemsPrice = dbOrderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;

  const totalPrice = Number(
    (itemsPrice + taxPrice + shippingPrice).toFixed(2)
  );

  // Create order
  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id, // from cookie (protect middleware)
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};