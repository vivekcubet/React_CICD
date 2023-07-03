import {createSlice} from '@reduxjs/toolkit';
export interface EquipmentSliceInterface {
  equipmentList: any[];
  fluidStickers: any[];
  dailyChecklists: any[];
  unSyncedChecklist: any[];
  checklistLog: any[];
  documentsList: any[];
}
const initialState: EquipmentSliceInterface = {
  equipmentList: [],
  fluidStickers: [],
  dailyChecklists: [],
  unSyncedChecklist: [],
  checklistLog: [],
  documentsList: [],
};
export const EquipmentSlice = createSlice({
  name: 'EquipmentReducer',
  initialState,
  reducers: {
    updateEquipmentList: (state, action) => {
      state.equipmentList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateFluidStickerList: (state, action) => {
      state.fluidStickers =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateDailyCheckList: (state, action) => {
      state.dailyChecklists =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateCheckListLog: (state, action) => {
      state.checklistLog =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateDocumentsList: (state, action) => {
      state.documentsList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },

    resetEquipments: state => {
      state.equipmentList = [];
      state.fluidStickers = [];
      state.dailyChecklists = [];
      state.checklistLog = [];
      state.documentsList = [];
    },
  },
});
export const {
  updateEquipmentList,
  updateFluidStickerList,
  updateDailyCheckList,
  resetEquipments,
  updateCheckListLog,
  updateDocumentsList,
} = EquipmentSlice.actions;
export default EquipmentSlice.reducer;
