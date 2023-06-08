/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Service } from '../interfaces';

export const stateInterface: Service = {
  id: '',
  created_at: 0,
  updated_at: 0,
  name: '',
  retries: 5,
  protocol: '',
  host: '',
  port: 80,
  path: '',
  connect_timeout: 60000,
  write_timeout: 60000,
  read_timeout: 60000,
};

const reducer = {
  routeOpen: false,
  refreshRouteTable: false,
};

const storeReducer = createSlice({
  name: 'modal',
  initialState: () => reducer,
  reducers: {
    updateValue(state, action) {
      if (action.payload.type === 'modal')
        state.routeOpen = action.payload.value;
      else state.refreshRouteTable = action.payload.value;
      console.log(action.payload);
      return state;
    },
  },
});

export const { updateValue } = storeReducer.actions;
export default storeReducer.reducer;
