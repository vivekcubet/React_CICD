import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React, {FC, useState} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';
import {
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import IconComponent from '../Icon/Icon';
import FastImage from 'react-native-fast-image';
interface ImageUploadInterface {
  value?: ImageInterface;
  PlaceHolder: string;
  onChangeImage(image: ImageInterface): any;
  error?: string;
  editable?: boolean;
  label: string;
  image?: string;
  onRemoveLogo?(): any;
  isHidden?: boolean;
}
export interface ImageInterface {
  uri?: string;
  path?: string;
  type?: string;
}
const ImageUpload: FC<ImageUploadInterface> = ({
  PlaceHolder = '',
  label = '',
  value = {},
  editable = true,
  onChangeImage,
  image = '',
  onRemoveLogo,
}) => {
  const [imageValue, setImage] = useState<ImageInterface>(value);
  const pickImage = async () => {
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
            'Selected file format is not supported',
            'Please choose a PNG, JPG, or JPEG file.',
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
          Alert.alert('Selected file size exceeds the limit of 2 MB.');
          return;
        }
        let imageFromBob = {
          name: selectedImage?.fileName,
          uri: selectedImage?.uri,
          type: selectedImage?.type,
        };
        onChangeImage(imageFromBob);
        setImage(imageFromBob);
        console.log(result, 'RESULT===', imageFromBob);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <View style={styles.container}>
        {!imageValue?.uri && !image && editable ? (
          <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
              disabled={!editable}
              onPress={() => pickImage()}
              style={[
                {maxHeight: getHeight(17), minHeight: getHeight(20)},
                styles.dropdownContainer,
              ]}>
              <Text style={styles.text}>{PlaceHolder}</Text>
            </TouchableOpacity>
            {/* {error ? ( */}
            <Text
              style={{
                marginTop: getHeight(120),
                marginLeft: getHeight(60),
                fontSize: getHeight(65),
                color: Colors.appYellow,
              }}>
              Supported formats: JPG, JPEG, or PNG. File size should be less
              than 2 MB.
            </Text>
            {/* ) : null} */}
          </>
        ) : (
          <>
            {imageValue?.uri || image ? (
              <>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.imageContainer}>
                  <FastImage
                    source={{
                      uri: imageValue?.uri ? imageValue?.uri : image,
                    }}
                    style={styles.logoImage}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  {editable ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (onRemoveLogo) {
                          onRemoveLogo();
                        }
                        onChangeImage({uri: ''});
                        setImage({uri: ''});
                      }}
                      style={styles.closeContainer}>
                      <IconComponent
                        iconName="close"
                        color={Colors.errorColor}
                        family="Ionicons"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </>
            ) : null}
          </>
        )}
      </View>
    </>
  );
};

export default ImageUpload;
