import React, { Fragment, PropsWithChildren, FC } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { selectFrequencyRate, selectPrecision, changeConnectionStatus } from '../../reducers/orderBooksReducer';
import { useAppSelector, useAppDispatch } from '../../store/hooks';

const getSubscribeMessage = (channel, fields) => {
  return ({
    ...fields,
    event: 'subscribe',
    symbol: 'tBTCUSD',
    channel,
  });
}

const WSProvider : FC<PropsWithChildren> = ({
  children
}) => {
  const dispatch = useAppDispatch();
  const precision = useAppSelector(selectPrecision);
  const frequencyRate = useAppSelector(selectFrequencyRate);
  const { sendMessage, readyState } = useWebSocket('wss://api-pub.bitfinex.com/ws/2', {
    onOpen: () => dispatch(changeConnectionStatus(ReadyState.OPEN))
  });

  useEffect(() => {
    sendMessage(JSON.stringify(getSubscribeMessage('book', {
      freq: frequencyRate,
      prec: precision,
    })));
  }, [readyState])

  return <Fragment>
    {children}
  </Fragment>;
};

export default WSProvider;
