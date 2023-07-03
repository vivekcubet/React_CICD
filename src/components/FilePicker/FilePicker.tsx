import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {getHeight} from '../../theme/Constants';
import {pickDocument} from '../../utils/helpers/filePicker';
import Colors from '../../theme/Colors';
interface FileUploadInterface {
  value?: fileInterface;
  PlaceHolder: string;
  onPickFile(file: any): any;
  error?: string;
  editable?: boolean;
  label: string;
  file?: any;
  isHidden?: boolean;
}
export interface fileInterface {
  uri?: string;
  name?: string;
  type?: string;
}
const FilePicker: FC<FileUploadInterface> = ({
  PlaceHolder = '',
  label = '',
  editable = true,
  file = null,
  error = '',
  onPickFile,
}) => {
  const pickFile = async () => {
    let pickedFile = await pickDocument();
    onPickFile(pickedFile);
  };
  return (
    <>
      <View style={styles.container}>
        <>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity
            disabled={!editable}
            onPress={() => pickFile()}
            style={[
              {maxHeight: getHeight(17), minHeight: getHeight(20)},
              styles.dropdownContainer,
            ]}>
            <Text
              style={[
                styles.text,
                {color: file ? Colors.black : Colors.placeholderColor},
              ]}>
              {file ? file?.name : PlaceHolder}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: getHeight(120),
              marginLeft: getHeight(60),
              fontSize: getHeight(65),
              color: Colors.appYellow,
            }}>
            Please choose JPEG,JPG,PNG,PDF,DOC,DOCX,XLS,XLXS format under 2MB in
            size
          </Text>
          {error ? (
            <Text
              style={{
                marginTop: getHeight(120),
                marginLeft: getHeight(60),
                fontSize: getHeight(65),
                color: Colors.errorColor,
              }}>
              {error}
            </Text>
          ) : null}
          {/* {error ? ( */}
          {/* <Text
            style={{
              marginTop: getHeight(120),
              marginLeft: getHeight(60),
              fontSize: getHeight(65),
              color: Colors.appYellow,
            }}>
            JPG, JPEG, or PNG format under 2MB in size
          </Text> */}
          {/* ) : null} */}
        </>
      </View>
    </>
  );
};

export default FilePicker;
