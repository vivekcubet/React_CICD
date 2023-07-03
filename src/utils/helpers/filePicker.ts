import {Alert} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
export const pickDocument = async () => {
  try {
    const selectedFile: any = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      type: [
        types.doc,
        types.docx,
        types.pdf,
        types.ppt,
        types.pptx,
        types.images,
        types.xls,
        types.xlsx,
      ],
    });
    console.log(selectedFile, 'DOC RESPONSE===');

    const fileSizeMB = selectedFile?.size / (1024 * 1024); // Convert to MB
    if (fileSizeMB > 2) {
      Alert.alert('Selected file exceeds the maximum size of 2MB.');
    } else {
      return {
        name: selectedFile?.name,
        uri: selectedFile?.uri,
        type: selectedFile?.type,
      };
    }
  } catch (err) {
    console.warn(err);
  }
};
