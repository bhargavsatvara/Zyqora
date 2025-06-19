import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import './assets/css/tailwind.css';
import Login from './pages/pages/auth/login';
import Signup from './pages/pages/auth/signup';
import ForgotPassword from './pages/pages/auth/forgot-password';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />}></Route>
       <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
    </Routes>
  );
}

export default App;
