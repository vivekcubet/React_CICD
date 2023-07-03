import {Platform, PermissionsAndroid} from 'react-native';
import RNBackgroundDownloader from 'react-native-background-downloader';

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    console.log('first', Platform.OS, Platform.OS === 'android');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Failed to request storage permission:', err);
      return false;
    }
  } else {
    console.error('Success to request storage permission:');
    // For non-Android platforms, assume permission is granted
    return true;
  }
};

const downloadFile = async (
  url: string,
  destinationPath: string,
  taskName: string,
) => {
  try {
    // const granted = await requestStoragePermission();
    // if (!granted) {
    //   console.log('Storage permission denied.');
    //   return false;
    // }

    let task = RNBackgroundDownloader.download({
      id: taskName,
      url: url,
      destination: destinationPath,
    });

    return new Promise((resolve, reject) => {
      task
        .begin(expectedBytes => {
          console.log(`Going to download ${expectedBytes} bytes!`);
        })
        .progress(percent => {
          console.log(`Downloaded: ${percent * 100}%`);
        })
        .done(() => {
          console.log('Download is done!');
          resolve(true);
        })
        .error(error => {
          console.log('Download canceled due to error:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('An error occurred while downloading the file:', error);
    return false;
  }
};

export default downloadFile;
