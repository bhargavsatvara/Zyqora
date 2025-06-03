import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import './assets/css/tailwind.css';
import Login from './pages/pages/auth/login';
import Signup from './pages/pages/auth/signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />}></Route>
       <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
    </Routes>
  );
}

export default App;
