import {createSlice} from '@reduxjs/toolkit';
export interface PartsSliceInterface {
  myServiceIntervals: any[];
  publicServiceIntervals: any[];
  archivedServiceIntervals: any[];
}
const initialState: PartsSliceInterface = {
  myServiceIntervals: [],
  publicServiceIntervals: [],
  archivedServiceIntervals: [],
};
export const ServiceIntervalSlice = createSlice({
  name: 'ServiceIntervalReducer',
  initialState,
  reducers: {
    updateMyServiceIntervals: (state, action) => {
      state.myServiceIntervals =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updatePublicServiceIntervals: (state, action) => {
      state.publicServiceIntervals =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateArchivedServiceIntervals: (state, action) => {
      state.archivedServiceIntervals =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    resetServiceIntervals: state => {
      state.archivedServiceIntervals = [];
      state.myServiceIntervals = [];
      state.publicServiceIntervals = [];
    },
  },
});
export const {
  updateMyServiceIntervals,
  updatePublicServiceIntervals,
  updateArchivedServiceIntervals,
  resetServiceIntervals,
} = ServiceIntervalSlice.actions;
export default ServiceIntervalSlice.reducer;
