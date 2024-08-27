import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Ensure you have an index.css file or adjust this line accordingly
import App from './App';
import reportWebVitals from './reportWebVitals'; // Ensure reportWebVitals.js exists or remove this line

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
