import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { OrderBookProps } from '../components/OrderBook/OrderBook.types';
import { ReadyState } from 'react-use-websocket';

export type CONNECTION_STATUS = ReadyState.CONNECTING | ReadyState.OPEN | ReadyState.UNINSTANTIATED | ReadyState.CLOSING | ReadyState.CLOSED;

export type Ticker = string;

export const tickers : Array<Ticker> = [];


export enum FREQUENCY_RATE {
  REAL_TIME = 'F0',
  THROTTLED = 'F1',
};

export enum PRECISION {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4'
};

interface OrderBooksState {
  orderBooks: Array<OrderBookProps>,
  precision: PRECISION;
  connectionStatus: CONNECTION_STATUS;
  frequencyRate: FREQUENCY_RATE;
  ticker: Ticker;
}

export const connectionStatusLabels = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

const initialState: OrderBooksState = {
  orderBooks: [],
  precision: PRECISION.P4,
  connectionStatus: ReadyState.UNINSTANTIATED,
  frequencyRate: FREQUENCY_RATE.REAL_TIME,
  ticker: 'ETH'
}

export const orderBooksSlice = createSlice({
  name: 'orderBooks',
  initialState,
  reducers: {
    setOrderBooks: (state, action: PayloadAction<Array<OrderBookProps>>) => {
      state.orderBooks = action.payload;
    },
    decreasePrecision: (state) => {
      const prevPrecisionKey = Object.values(PRECISION).indexOf(state.precision) - 1;
      state.precision = PRECISION[Object.keys(PRECISION)[prevPrecisionKey] as PRECISION];
    },
    increasePrecision: (state) => {
      const nextPrecisionKey = Object.values(PRECISION).indexOf(state.precision) + 1;
      state.precision = PRECISION[Object.keys(PRECISION)[nextPrecisionKey] as PRECISION];
    },
    changeFrequencyRate: (state, action: PayloadAction<FREQUENCY_RATE>) => {
      state.frequencyRate = action.payload;
    },
    throttleConnection: (state) => {
      state.frequencyRate = FREQUENCY_RATE.THROTTLED;
    },
    activateConnection: (state) => {
      state.frequencyRate = FREQUENCY_RATE.REAL_TIME;
    },
    changeConnectionStatus: (state, action: PayloadAction<CONNECTION_STATUS>) => {
      state.connectionStatus = action.payload;
    },
    updateOrderBook: (state, action: PayloadAction<OrderBookProps>) => {
      state.orderBooks = [...state.orderBooks, action.payload];
    }
  }
})

export const { updateOrderBook, setOrderBooks, increasePrecision, decreasePrecision, activateConnection, throttleConnection, changeConnectionStatus } = orderBooksSlice.actions;

export const selectOrderBooks = (state: RootState) => state.orderBooks.orderBooks;
export const selectPrecision = (state: RootState) => state.orderBooks.precision;
export const selectFrequencyRate = (state: RootState) => state.orderBooks.frequencyRate;
export const selectConnectionStatus = (state: RootState) => state.orderBooks.connectionStatus;

export default orderBooksSlice.reducer;
