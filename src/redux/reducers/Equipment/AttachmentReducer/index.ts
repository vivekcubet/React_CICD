import {createSlice} from '@reduxjs/toolkit';
export interface AttachmentSliceInterface {
  attachmentList: any[];
}
const initialState: AttachmentSliceInterface = {
  attachmentList: [],
};
export const AttachmentSlice = createSlice({
  name: 'AttachmentReducer',
  initialState,
  reducers: {
    updateAttachmentList: (state, action) => {
      state.attachmentList =
        action.payload && action.payload.length > 0 ? action.payload : [];
    },

    resetAttachments: state => {
      state.attachmentList = [];
    },
  },
});
export const {updateAttachmentList, resetAttachments} = AttachmentSlice.actions;
export default AttachmentSlice.reducer;
