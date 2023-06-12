/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { snackMessageProp } from '../interfaces';
import {
  ACTION_TYPES,
  ROUTE_DETAILS_INTERFACE,
  SERVICE_DETAILS_INTERFACE,
} from '../Shared/constants';

const snackMessageInterface: snackMessageProp = {
  message: '',
  severity: 'success',
};

const reducer = {
  routeOpen: false,
  refreshRouteTable: false,
  openSnackBar: false,
  snackBar: snackMessageInterface,
  routeData: ROUTE_DETAILS_INTERFACE,
  serviceData: SERVICE_DETAILS_INTERFACE,
};

const storeReducer = createSlice({
  name: 'store',
  initialState: () => reducer,
  reducers: {
    updateValue(state, action) {
      switch (action.payload.type) {
        case ACTION_TYPES.OPEN_ROUTE_MODAL:
          state.routeOpen = action.payload.value;
          return state;
        case ACTION_TYPES.REFRESH_ROUTE_TABLE:
          state.refreshRouteTable = action.payload.value;
          return state;
        case ACTION_TYPES.SET_SNACK_BAR_MESSAGE:
          state.snackBar.message = action.payload.message;
          state.snackBar.severity = action.payload.severity;
          return state;
        case ACTION_TYPES.OPEN_SNACK_BAR:
          state.openSnackBar = action.payload.value;
          return state;
        case ACTION_TYPES.UPDATE_ROUTE_DATA:
          state.routeData = action.payload.data;
          return state;
        case ACTION_TYPES.UPDATE_ROUTE_DATA_VALUES:
          state.routeData = {
            ...state.routeData,
            [action.payload.key]: action.payload.value,
          };
          return state;
        case ACTION_TYPES.UPDATE_SERVICE_DATA:
          state.serviceData = action.payload.data;
          return state;
        case ACTION_TYPES.UPDATE_SERVICE_DATA_VALUES:
          state.serviceData = {
            ...state.serviceData,
            [action.payload.key]: action.payload.value,
          };
          return state;
        default:
          return state;
      }
    },
  },
});

export const { updateValue } = storeReducer.actions;
export default storeReducer.reducer;
