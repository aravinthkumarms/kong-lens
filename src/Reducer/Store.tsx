import { configureStore } from '@reduxjs/toolkit';
// This is how you import a reducer, based on the prior export.
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import reducer from './StoreReducer';

const store = configureStore({
  reducer: {
    // You are free to call the LHS what you like, but it must have a reducer on the RHS.
    reducer,
  },
});

export default store;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export type RootState = ReturnType<typeof store.getState>;
