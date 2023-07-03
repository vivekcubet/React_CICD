import {createSlice} from '@reduxjs/toolkit';
export interface TemplatesSliceInterface {
  myServiceTemplates: any[];
  publicServiceTemplates: any[];
  archivedServiceTemplates: any[];
}
const initialState: TemplatesSliceInterface = {
  myServiceTemplates: [],
  publicServiceTemplates: [],
  archivedServiceTemplates: [],
};
export const ServiceTemplateSlice = createSlice({
  name: 'ServiceTemplateReducer',
  initialState,
  reducers: {
    updateMyServiceTemplates: (state, action) => {
      state.myServiceTemplates =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updatePublicServiceTemplates: (state, action) => {
      state.publicServiceTemplates =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    updateArchivedServiceTemplates: (state, action) => {
      state.archivedServiceTemplates =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },
    resetServiceTemplates: state => {
      state.archivedServiceTemplates = [];
      state.myServiceTemplates = [];
      state.publicServiceTemplates = [];
    },
  },
});
export const {
  updateMyServiceTemplates,
  updatePublicServiceTemplates,
  updateArchivedServiceTemplates,
  resetServiceTemplates,
} = ServiceTemplateSlice.actions;
export default ServiceTemplateSlice.reducer;
