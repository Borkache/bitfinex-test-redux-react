import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import orderBooksReducer from '../reducers/orderBooksReducer';

export const store = configureStore({
  reducer: {
    orderBooks: orderBooksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
