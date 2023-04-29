import React, { FC } from 'react';
import { OrderBookProps } from './OrderBook.types';

const OrderBook : FC<OrderBookProps> = ({
  price,
  count,
  amount
}) => {
  return <div className="book__row">
    <div className="book__count">{count}</div>
    <div className="book__amount">{amount}</div>
    <div className="book__total">{price * amount}</div>
    <div className="book__price">{price}</div>
  </div>
};

export default OrderBook;
