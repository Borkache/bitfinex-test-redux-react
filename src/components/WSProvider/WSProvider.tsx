import React, { useState, useEffect, Fragment, PropsWithChildren, FC } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { CONNECTION_STATUS, PRECISION, FREQUENCY_RATE, connectionStatusLabels, selectConnectionStatus, selectFrequencyRate, selectPrecision, changeConnectionStatus, increasePrecision, decreasePrecision, activateConnection, throttleConnection, updateOrderBook, setOrderBooks } from '../../reducers/orderBooksReducer';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { OrderBookProps } from '../OrderBook/OrderBook.types';

const getSubscribeMessage = (channelId : string, fields : {[key : string]: string}) => {
  return JSON.stringify({
    ...fields,
    event: 'subscribe',
    symbol: 'tBTCUSD',
    channel: channelId,
  });
}

const WSProvider : FC<PropsWithChildren> = ({
  children
}) => {
  const [channelId, setChannelId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const precision = useAppSelector<PRECISION>(selectPrecision);
  const frequencyRate = useAppSelector<FREQUENCY_RATE>(selectFrequencyRate);
  const connectionStatus = useAppSelector<CONNECTION_STATUS>(selectConnectionStatus);

  const handleOrderBooksMessage = (data : Array<number>) => {
    const getOrderObject = ((orderBook : Array<number>) : OrderBookProps => ({
      'price': orderBook[0],
      'count': orderBook[1],
      'amount': orderBook[2],
    }));
    const nestedData = data[1];
    if (Array.isArray(nestedData) && Array.isArray(nestedData[0])) {
      const orders : Array<OrderBookProps> = nestedData.map((order : Array<number>) => getOrderObject(order));
      dispatch(setOrderBooks(orders));
    } else if (Array.isArray(nestedData)) {
      dispatch(updateOrderBook(getOrderObject(nestedData)));
    }
  }

  const { sendMessage, readyState } = useWebSocket('wss://api-pub.bitfinex.com/ws/2', {
    onOpen: () => dispatch(changeConnectionStatus(ReadyState.OPEN)),
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      const { event } = data;
      setChannelId(data.chanId);
      if (event === 'subscribed') {
        setChannelId(data.chanId);
      } else if (event === 'unsubscribed') {
        sendMessage(JSON.stringify({
          event: 'unsubscribe',
          chanId: channelId,
        }));
        changeConnectionStatus(ReadyState.OPEN);
      } else if (Array.isArray(data)) {
        handleOrderBooksMessage(data);
      }
    },
    onClose: () => dispatch(changeConnectionStatus(ReadyState.CLOSED)),
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    //attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
    reconnectInterval: (attemptNumber) =>
      Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
  });

  useEffect(() => {
    sendMessage(getSubscribeMessage('book', {
      freq: frequencyRate,
      prec: precision,
    }));
  }, [readyState]);

  return <Fragment>
    <button onClick={() => {
      // to-do
    }} disabled={connectionStatusLabels[connectionStatus] !== 'Connected'}>Connect</button>
    <button onClick={() => {
      // to-do
    }} disabled={connectionStatusLabels[connectionStatus] === 'Connected'}>Disconnect</button>
    <button disabled={precision === PRECISION.P4} onClick={() => {
      dispatch(increasePrecision());
      sendMessage(JSON.stringify({
        event: 'unsubscribe',
        chanId: channelId,
      }));
      sendMessage(getSubscribeMessage('book', {
        freq: frequencyRate,
        prec: precision,
      }));
    }}>Increase precision</button>
    <button disabled={precision === PRECISION.P0} onClick={() => {
      dispatch(decreasePrecision());
      sendMessage(JSON.stringify({
        event: 'unsubscribe',
        // @ts-ignore
        chanId: channelId,
      }));
      sendMessage(getSubscribeMessage('book', {
        freq: frequencyRate,
        prec: precision,
      }));
    }}>Decrease precision</button>
    <button onClick={() => dispatch(frequencyRate === FREQUENCY_RATE.REAL_TIME ? throttleConnection() : activateConnection())}>{frequencyRate === FREQUENCY_RATE.REAL_TIME ? 'Throttle connection' : 'Activate connection'}</button>
    {children}
  </Fragment>;
};

export default WSProvider;
