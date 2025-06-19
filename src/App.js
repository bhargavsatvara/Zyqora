import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import './assets/css/tailwind.css';
import Login from './pages/pages/auth/login';
import Signup from './pages/pages/auth/signup';

import ForgotPassword from './pages/pages/auth/forgot-password';
import ResetPassword from './pages/pages/auth/reset-password';
import EmailConfirmation from './pages/pages/email-template/email-confirmation';
import EmailCart from './pages/pages/email-template/email-cart';
import EmailOffers from './pages/pages/email-template/email-offers';
import EmailOrderSuccess from './pages/pages/email-template/email-order-success';
import EmailResetPassword from './pages/pages/email-template/email-reset-password';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />}></Route>
       <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>

      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
      <Route path="/reset-password" element={<ResetPassword/>}></Route>
      <Route path="/email-confirmation" element={<EmailConfirmation/>}></Route>
      <Route path="/email-cart" element={<EmailCart/>}></Route>
      <Route path="/email-offers" element={<EmailOffers/>}></Route>
      <Route path="/email-order-success" element={<EmailOrderSuccess/>}></Route>
      <Route path="/email-reset-password" element={<EmailResetPassword/>}></Route>
    </Routes>
  );
}

export default App;
