import {
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import {Alert} from 'react-native';
export const pickImage = async () => {
  let mediaType: MediaType = 'photo';
  const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  let quality: PhotoQuality = 1;
  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    mediaType: mediaType,
    // maxWidth: 1200,
    // maxHeight: 1200,
    quality,
  };
  try {
    const result: any = await launchImageLibrary(options);
    if (result?.assets) {
      console.log(result?.assets[0], 'IMAGE=======');
      let selectedImage = result?.assets[0];
      // Check if the selected image is of an accepted type
      if (!acceptedTypes.includes(selectedImage.type)) {
        Alert.alert(
          ' Supported formats: JPG, JPEG, or PNG.',
          ' File size should be less than 2 MB',
          [
            {
              text: 'ok',
              onPress: () => null,
              style: 'default',
            },
          ],
          {
            cancelable: true,
            onDismiss: () => null,
          },
        );
        return;
      }
      // Check if the selected image is within the size limit
      if (selectedImage.fileSize > 2 * 1024 * 1024) {
        Alert.alert('Selected file size exceeds the limit of 2MB.');
        return;
      }
      let imageFromBob = {
        name: selectedImage?.fileName,
        uri: selectedImage?.uri,
        type: selectedImage?.type,
      };
      return imageFromBob;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
