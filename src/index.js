import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App'; // Cập nhật đường dẫn đến App.js

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);