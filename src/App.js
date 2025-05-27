import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import './assets/css/tailwind.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />}></Route>
     
    </Routes>
  );
}

export default App;
