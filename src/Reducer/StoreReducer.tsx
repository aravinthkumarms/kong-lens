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
          state.routeData.name = action.payload.data.name;
          state.routeData.destinations = action.payload.data.destinations;
          state.routeData.hosts = action.payload.data.hosts;
          state.routeData.headers = action.payload.data.headers;
          state.routeData.tags = action.payload.data.tags;
          state.routeData.https_redirect_status_code =
            action.payload.data.https_redirect_status_code;
          state.routeData.methods = action.payload.data.methods;
          state.routeData.path_handling = action.payload.data.path_handling;
          state.routeData.paths = action.payload.data.paths;
          state.routeData.preserve_host = action.payload.data.preserve_host;
          state.routeData.protocols = action.payload.data.protocols;
          state.routeData.regex_priority = action.payload.data.regex_priority;
          state.routeData.service = action.payload.data.service;
          state.routeData.snis = action.payload.data.snis;
          state.routeData.sources = action.payload.data.sources;
          state.routeData.strip_path = action.payload.data.strip_path;
          return state;
        case ACTION_TYPES.UPDATE_ROUTE_DATA_VALUES:
          state.routeData = {
            ...state.routeData,
            [action.payload.key]: action.payload.value,
          };
          return state;
        case ACTION_TYPES.UPDATE_SERVICE_DATA:
          state.serviceData.name = action.payload.data.name;
          state.serviceData.description = action.payload.data.description;
          state.serviceData.ca_certificates =
            action.payload.data.ca_certificates;
          state.serviceData.client_certificate =
            action.payload.data.client_certificate;
          state.serviceData.tags = action.payload.data.tags;
          state.serviceData.connect_timeout =
            action.payload.data.connect_timeout;
          state.serviceData.write_timeout = action.payload.data.write_timeout;
          state.serviceData.read_timeout = action.payload.data.read_timeout;
          state.serviceData.id = action.payload.data.id;
          state.serviceData.host = action.payload.data.host;
          state.serviceData.protocol = action.payload.data.protocol;
          state.serviceData.path = action.payload.data.path;
          state.serviceData.port = action.payload.data.port;
          state.serviceData.retries = action.payload.data.retries;
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
