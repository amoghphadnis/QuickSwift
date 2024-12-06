import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
<<<<<<< HEAD
import {Provider } from 'react-redux';
=======
import { Provider } from 'react-redux';
>>>>>>> 34e730668641aca9b1e2a066cbc4fa72fed20172
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
<<<<<<< HEAD
    <App />
=======
      {/* Wrap App with BrowserRouter */}
      <BrowserRouter future={{
        v7_startTransition: true,
      }}>
        <App />
      </BrowserRouter>
>>>>>>> 34e730668641aca9b1e2a066cbc4fa72fed20172
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
