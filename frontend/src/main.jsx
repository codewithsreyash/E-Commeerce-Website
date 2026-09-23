import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './components/storefront/CartContext';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              color: '#FBD000',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
              fontFamily: "'Russo One', sans-serif",
              fontSize: '10px',
              borderRadius: '0px',
            },
          }}
        />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>,
);
