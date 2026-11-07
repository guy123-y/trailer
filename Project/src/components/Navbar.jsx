import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '15px 20px', 
      background: '#f4f4f4', 
      marginBottom: '20px',
      direction: 'rtl',
      textAlign: 'right'
    }}>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
        דף הבית
      </Link>
      <Link to="/add-route" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
        הוספת מסלול
      </Link>
    </nav>
  );
}