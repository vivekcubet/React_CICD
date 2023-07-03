import RNFS from 'react-native-fs';

const deleteFile = async (filePath: string) => {
  try {
    await RNFS.unlink(filePath);
    console.log('File deleted successfully.');
  } catch (error) {
    console.error('An error occurred while deleting the file:', error);
  }
};

export default deleteFile;
