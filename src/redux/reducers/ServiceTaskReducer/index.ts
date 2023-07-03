import {createSlice} from '@reduxjs/toolkit';
export interface TasksSliceInterface {
  myServiceTasks: any[];
  publicServiceTasks: any[];
  archivedServiceTasks: any[];
}
const initialState: TasksSliceInterface = {
  myServiceTasks: [],
  publicServiceTasks: [],
  archivedServiceTasks: [],
};
export const ServiceTaskSlice = createSlice({
  name: 'ServiceTaskReducer',
  initialState,
  reducers: {
    updateMyServiceTasks: (state, action) => {
      state.myServiceTasks =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updatePublicServiceTasks: (state, action) => {
      state.publicServiceTasks =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateArchivedServiceTasks: (state, action) => {
      state.archivedServiceTasks =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    resetServiceTasks: state => {
      state.archivedServiceTasks = [];
      state.myServiceTasks = [];
      state.publicServiceTasks = [];
    },
  },
});
export const {
  updateMyServiceTasks,
  updatePublicServiceTasks,
  updateArchivedServiceTasks,
  resetServiceTasks,
} = ServiceTaskSlice.actions;
export default ServiceTaskSlice.reducer;
