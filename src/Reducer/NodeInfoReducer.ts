import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface DataSet {
  loading: boolean;
  data: any;
}

const initialState: DataSet = {
  data: [],
  loading: false,
};
