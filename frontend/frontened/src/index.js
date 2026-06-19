import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import { HelmetProvider } from 'react-helmet-async';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';

// Screens
import Homescreen from './screens/Homescreen';
import Productscreen from './screens/Productscreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Private
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';

// Admin
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';

// Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>

      {/* PUBLIC */}
      <Route index element={<Homescreen />} />
      <Route path='page/:pageNumber' element={<Homescreen />} />
      <Route path='search/:keyword/page/:pageNumber?' element={<Homescreen />} />

      <Route path='product/:id' element={<Productscreen />} />
      <Route path='cart' element={<CartScreen />} />
      <Route path='login' element={<LoginScreen />} />
      <Route path='register' element={<RegisterScreen />} />

      {/* PRIVATE */}
      <Route element={<PrivateRoute />}>
        <Route path='profile' element={<ProfileScreen />} />
        <Route path='shipping' element={<ShippingScreen />} />
        <Route path='payment' element={<PaymentScreen />} />
        <Route path='placeorder' element={<PlaceOrderScreen />} />
        <Route path='order/:id' element={<OrderScreen />} />
      </Route>

      {/* ADMIN */}
      <Route element={<AdminRoute />}>
        <Route path='admin/orderlist' element={<OrderListScreen />} />

        <Route path='admin/productlist' element={<ProductListScreen />} />
        <Route path='admin/productlist/page/:pageNumber' element={<ProductListScreen />} />

        <Route path='admin/product/:id/edit' element={<ProductEditScreen />} />

        <Route path='admin/userlist' element={<UserListScreen />} />
        <Route path='admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>

    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);