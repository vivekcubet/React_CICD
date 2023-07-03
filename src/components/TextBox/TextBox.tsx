import {TextInput, Platform, View} from 'react-native';
import React, {FC} from 'react';
import styles from '../InputText/styles';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
interface TextBoxInterface {
  value?: string;
  PlaceHolder: string;
  isPassword?: boolean;
  keyboardType?: any;
  onChange?: any;
  error?: string;
  onBlur?: any;
  editable?: boolean;
  isTextArea?: boolean;
  isPhone?: boolean;
  maxLength?: number;
}
const TextBox: FC<TextBoxInterface> = ({
  PlaceHolder = '',
  onBlur,
  onChange,
  editable = true,
  value = '',
  keyboardType = 'default',
  isTextArea = false,
  maxLength = 250,
}) => {
  const marginTop = Platform.OS === 'ios' ? getHeight(40) : getHeight(505);
  const defaultPadding = 0;
  const width = '92%';
  const maxHeight = !isTextArea ? getHeight(17) : getHeight(1);
  const minHeight = !isTextArea ? getHeight(20) : getHeight(8);
  return (
    <View
      style={[
        {maxHeight: maxHeight, minHeight: minHeight},
        styles.dropdownContainer,
      ]}>
      <TextInput
        maxLength={maxLength}
        editable={editable}
        multiline={isTextArea}
        scrollEnabled={false}
        onChangeText={text => {
          onChange(text);
        }}
        value={value}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.placeholderColor}
        placeholder={PlaceHolder}
        onBlur={onBlur}
        style={[
          styles.text,
          {color: value ? Colors.black : Colors.placeholderColor},
          {
            width: width,
            marginTop: isTextArea ? marginTop : defaultPadding,
            marginBottom: isTextArea ? getWidth(70) : defaultPadding,
          },
        ]}
      />
    </View>
  );
};

export default TextBox;
