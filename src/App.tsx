import React, { FC } from 'react';
import logo from './logo.svg';
import './App.css';
import WSProvider from './components/WSProvider/WSProvider';
import OrderBooks from './components/OrderBooks/OrderBooks';

const App : FC = () => {
  return (
    <WSProvider>
      <OrderBooks />
    </WSProvider>
  );
}

export default App;
