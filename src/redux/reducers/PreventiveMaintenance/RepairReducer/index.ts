import {createSlice} from '@reduxjs/toolkit';
export interface RepairSliceInterface {
  repairList: any[];
  repairDocsList: any[];
}
const initialState: RepairSliceInterface = {
  repairList: [],
  repairDocsList: [],
};
export const RepairSlice = createSlice({
  name: 'RepairReducer',
  initialState,
  reducers: {
    updateRepairList: (state, action) => {
      state.repairList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateRepairDocs: (state, action) => {
      state.repairDocsList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    resetRepairReducer: state => {
      state.repairList = [];
      state.repairDocsList = [];
    },
  },
});
export const {updateRepairList, resetRepairReducer, updateRepairDocs} =
  RepairSlice.actions;
export default RepairSlice.reducer;
