import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Pricing from './pages/Pricing/Pricing';
import Contact from './pages/Contact/Contact';
import Login from './components/auth/Login';
import App from './App';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import PaymentSimulator from './pages/PaymentSimulator';

const AppRouter = () => {
  const isAuthenticated = localStorage.getItem('token');
  
  console.log('AppRouter - isAuthenticated:', !!isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Rutas pÃºblicas con navbar */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/pricing" element={
          <>
            <Navbar />
            <Pricing />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <Contact />
          </>
        } />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas de pago */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/simulator" element={<PaymentSimulator />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/payment/pending" element={<PaymentPending />} />
        <Route path="/payment/simulator" element={<PaymentSimulator />} />
        
        {/* Ruta protegida de la app */}
        <Route 
          path="/app/*" 
          element={isAuthenticated ? <App /> : <Navigate to="/login" replace />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;