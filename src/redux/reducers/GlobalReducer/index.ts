import {createSlice} from '@reduxjs/toolkit';
export interface GlobalSliceInterface {
  isLoading: boolean;
  sum: number;
  accessToken: string;
  refreshToken: string;
  showAlert: {
    title: string;
    message: string;
    isOpen: boolean;
  };
  selectedEquipment: any;
}
const initialState: GlobalSliceInterface = {
  isLoading: false,
  showAlert: {
    title: '',
    message: '',
    isOpen: false,
  },
  accessToken: '',
  refreshToken: '',
  sum: 0,
  selectedEquipment: null,
};
export const globalSlice = createSlice({
  name: 'globalReducer',
  initialState,
  reducers: {
    toggleLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    showAlert: (state, action) => {
      let alert = {...action.payload, isOpen: true};
      state.showAlert = alert;
    },
    hideAlert: state => {
      state.showAlert = initialState.showAlert;
    },
    updateEquipment: (state, action) => {
      console.log(action.payload, 'TOKEN LOAD====');
      state.selectedEquipment = action.payload;
    },
    updateSum: (state, action) => {
      state.sum = action.payload;
    },
    updateAccessToken: (state, action) => {
      console.log(action.payload, 'TOKEN LOAD====');
      state.accessToken = action.payload.accessToken;
    },
  },
});
export const {toggleLoader, updateSum, updateEquipment, updateAccessToken} =
  globalSlice.actions;
export default globalSlice.reducer;
