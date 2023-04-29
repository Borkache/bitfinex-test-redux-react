import React, { FC } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectOrderBooks, selectConnectionStatus } from '../../reducers/orderBooksReducer';
import OrderBook from '../OrderBook/OrderBook';
import { OrderBookProps } from '../OrderBook/OrderBook.types';
import { ReadyState } from 'react-use-websocket';

const connectionStatusLabels = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

const OrderBooks : FC = () => {
  const orderBooks = useAppSelector(selectOrderBooks);
  const connectionStatus = useAppSelector(selectConnectionStatus);

  return <div>
    Connection status: {connectionStatusLabels[connectionStatus]}
    <div className="book__rows">
      {orderBooks.map((orderBook : OrderBookProps) => <OrderBook {...orderBook} />)
    }
    </div>
  </div>
};

export default OrderBooks;
