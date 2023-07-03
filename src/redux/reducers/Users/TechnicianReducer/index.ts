import {createSlice} from '@reduxjs/toolkit';
export interface TechnicianSliceInterface {
  companyTechnicians: any[];
}
const initialState: TechnicianSliceInterface = {
  companyTechnicians: [],
};
export const TechnicianSlice = createSlice({
  name: 'TechnicianReducer',
  initialState,
  reducers: {
    updateCompanyTechnicians: (state, action) => {
      state.companyTechnicians =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },

    resetTechnicians: state => {
      state.companyTechnicians = [];
    },
  },
});
export const {updateCompanyTechnicians, resetTechnicians} =
  TechnicianSlice.actions;
export default TechnicianSlice.reducer;
