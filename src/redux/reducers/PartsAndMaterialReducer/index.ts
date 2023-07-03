import {createSlice} from '@reduxjs/toolkit';
export interface PartsSliceInterface {
  partsCategories: any[];
  partsMeasurementTypes: any[];
  myPartsAndMeterial: any[];
  publicPartsAndMeterial: any[];
  archivedPartsList: any[];
}
const initialState: PartsSliceInterface = {
  partsCategories: [],
  partsMeasurementTypes: [],
  myPartsAndMeterial: [],
  publicPartsAndMeterial: [],
  archivedPartsList: [],
};
export const PartsAndMaterialSlice = createSlice({
  name: 'PartsAndMaterialReducer',
  initialState,
  reducers: {
    updatePartsCategories: (state, action) => {
      state.partsCategories =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updatePartsMeasurements: (state, action) => {
      state.partsMeasurementTypes =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateMyPartsAndMaterials: (state, action) => {
      console.log(action.payload, 'NEW PARTS====');
      state.myPartsAndMeterial =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updatePublicPartsAndMaterials: (state, action) => {
      console.log(action.payload, 'PUBLIC PARTS==');
      state.publicPartsAndMeterial =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateArchivedPartsAndMaterials: (state, action) => {
      state.archivedPartsList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    resetPartsAndMaterialSlice: state => {
      state.archivedPartsList = [];
      state.myPartsAndMeterial = [];
      state.partsMeasurementTypes = [];
      state.publicPartsAndMeterial = [];
      state.partsCategories = [];
    },
  },
});
export const {
  updatePartsCategories,
  updatePartsMeasurements,
  updateMyPartsAndMaterials,
  updatePublicPartsAndMaterials,
  updateArchivedPartsAndMaterials,
  resetPartsAndMaterialSlice,
} = PartsAndMaterialSlice.actions;
export default PartsAndMaterialSlice.reducer;
