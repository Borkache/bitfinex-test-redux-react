import React, { FC } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectOrderBooks } from '../../reducers/orderBooksReducer';
import OrderBook from '../OrderBook/OrderBook';
import { OrderBookProps } from '../OrderBook/OrderBook.types';

const OrderBooks : FC = () => {
  const orderBooks = useAppSelector(selectOrderBooks);

  return <div className="book__main">
    <div className="book__header">
      <div className="book__count">Count</div>
      <div className="book__amount">Amount</div>
      <div className="book__total">Total</div>
      <div className="book__price">Price</div>
    </div>
    <div className="book__rows">
      {
        orderBooks.map((orderBook : OrderBookProps) => <OrderBook {...orderBook} />)
      }
    </div>
  </div>
};

export default OrderBooks;
