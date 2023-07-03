import {createSlice} from '@reduxjs/toolkit';
export interface ServiceSliceInterface {
  activeServices: any[];
  finishedServices: any[];
  completedServices: any[];
  serviceDocList: any[];
}
const initialState: ServiceSliceInterface = {
  activeServices: [],
  finishedServices: [],
  completedServices: [],
  serviceDocList: [],
};
export const ServiceSlice = createSlice({
  name: 'ServiceReducer',
  initialState,
  reducers: {
    updateActiveServices: (state, action) => {
      state.activeServices =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateFinishedServices: (state, action) => {
      state.finishedServices =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateCompletedServices: (state, action) => {
      state.completedServices =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateServiceDocList: (state, action) => {
      state.serviceDocList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },

    resetServiceReducer: state => {
      state.activeServices = [];
      state.completedServices = [];
      state.finishedServices = [];
      state.serviceDocList = [];
    },
  },
});
export const {
  updateActiveServices,
  updateFinishedServices,
  updateCompletedServices,
  resetServiceReducer,
  updateServiceDocList,
} = ServiceSlice.actions;
export default ServiceSlice.reducer;
