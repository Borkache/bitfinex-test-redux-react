import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { OrderBookProps } from '../components/OrderBook/OrderBook.types';
import { ReadyState } from 'react-use-websocket';

export type CONNECTION_STATUS = ReadyState.CONNECTING | ReadyState.OPEN | ReadyState.UNINSTANTIATED | ReadyState.CLOSING | ReadyState.CLOSED;

export type Ticker = string;

export const tickers : Array<Ticker> = [];

interface OrderBooksState {
  orderBooks: Array<OrderBookProps>,
  precision: number;
  connectionStatus: CONNECTION_STATUS;
  frequencyRate: number;
  ticker: Ticker;
}

const initialState: OrderBooksState = {
  orderBooks: [],
  precision: 0,
  connectionStatus: ReadyState.UNINSTANTIATED,
  frequencyRate: 1,
  ticker: 'ETH'
}

export const orderBooksSlice = createSlice({
  name: 'orderBooks',
  initialState,
  reducers: {
    setOrderBooks: (state, action: PayloadAction<Array<OrderBookProps>>) => {
      state.orderBooks = action.payload;
    },
    throttleConnection: (state) => {
      state.frequencyRate = 0;
    },
    changePrecision: (state, action: PayloadAction<number>) => {
      state.precision = action.payload;
    },
    setTicker: (state, action: PayloadAction<Ticker>) => {
      state.ticker = action.payload;
    },
    changeConnectionStatus: (state, action: PayloadAction<CONNECTION_STATUS>) => {
      state.connectionStatus = action.payload;
    }
  }
})

export const { setOrderBooks, throttleConnection, changePrecision, setTicker, changeConnectionStatus } = orderBooksSlice.actions;

export const selectOrderBooks = (state: RootState) => state.orderBooks.orderBooks;
export const selectPrecision = (state: RootState) => state.orderBooks.precision;
export const selectConnectionStatus = (state: RootState) => state.orderBooks.connectionStatus;
export const selectTicker = (state: RootState) => state.orderBooks.ticker;

export default orderBooksSlice.reducer;
