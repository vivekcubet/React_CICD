import {createSlice} from '@reduxjs/toolkit';
export interface EquipmentModelInterface {
  isLoading: boolean;
  sum: number;
  equipmentCategories: any[];
  myEquipmentModels: any[];
  publicEquipmentModels: any[];
  archivedEquipmentModels: any[];
}
const initialState: EquipmentModelInterface = {
  isLoading: false,
  sum: 0,
  equipmentCategories: [],
  myEquipmentModels: [],
  publicEquipmentModels: [],
  archivedEquipmentModels: [],
};
export const EquipmentModelSlice = createSlice({
  name: 'globalReducer',
  initialState: initialState,
  reducers: {
    toggleLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    updateCategories: (state, action) => {
      state.equipmentCategories = action.payload;
    },
    updateMyEquipmentModel: (state, action) => {
      state.myEquipmentModels = action.payload;
    },
    updatePublicEquipmentModel: (state, action) => {
      state.publicEquipmentModels = action.payload;
    },
    updateArchivedEquipmentModel: (state, action) => {
      state.archivedEquipmentModels = action.payload;
    },
    resetEquipmentModelSlice: state => {
      console.log('REACHED=== PUBLIC PARTS==');
      state.equipmentCategories = [];
      state.myEquipmentModels = [];
      state.publicEquipmentModels = [];
      state.archivedEquipmentModels = [];
    },
  },
});
export const {
  toggleLoader,
  updateCategories,
  updateMyEquipmentModel,
  updatePublicEquipmentModel,
  updateArchivedEquipmentModel,
  resetEquipmentModelSlice,
} = EquipmentModelSlice.actions;
export default EquipmentModelSlice.reducer;
