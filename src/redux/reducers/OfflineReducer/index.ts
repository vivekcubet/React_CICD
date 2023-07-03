import {createSlice} from '@reduxjs/toolkit';
export interface OfflineSliceInterface {
  dailyCheckList: any[];
  repairOfflineList: any;
  serviceOfflineList: any;
  currentHourHistory: any;
  fluidResetLog: any;
}
const initialState: OfflineSliceInterface = {
  dailyCheckList: [],
  repairOfflineList: [],
  serviceOfflineList: [],
  currentHourHistory: {},
  fluidResetLog: {},
};
export const OfflineSlice = createSlice({
  name: 'OfflineReducer',
  initialState,
  reducers: {
    updateOfflineDailyList: (state, action) => {
      state.dailyCheckList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateOfflineRepairList: (state, action) => {
      state.repairOfflineList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateOfflineServiceList: (state, action) => {
      state.serviceOfflineList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateCurrentHourLog: (state, action) => {
      state.currentHourHistory = action.payload ? action.payload : {};
    },
    updateFluidResetHourLog: (state, action) => {
      state.fluidResetLog = action.payload ? action.payload : {};
    },
    clearOfflineDailyLog: state => {
      state.dailyCheckList = [];
    },
    clearOfflineRepairLog: state => {
      state.repairOfflineList = [];
    },
    clearOfflineServiceLog: state => {
      state.serviceOfflineList = [];
    },
    resetOffline: state => {
      state.dailyCheckList = [];
      state.repairOfflineList = [];
      state.serviceOfflineList = [];
      state.currentHourHistory = {};
      state.fluidResetLog = {};
    },
  },
});
export const {
  updateOfflineDailyList,
  updateOfflineRepairList,
  updateOfflineServiceList,
  clearOfflineRepairLog,
  clearOfflineServiceLog,
  updateFluidResetHourLog,
  updateCurrentHourLog,
  resetOffline,
  clearOfflineDailyLog,
} = OfflineSlice.actions;
export default OfflineSlice.reducer;
