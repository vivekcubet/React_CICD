import {View, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
import Icon from '../Icon/Icon';
import {getHeight} from '../../theme/Constants';

interface SearchInterface {
  searchValue?: string;
  onChange?: any;
  onEndEditing?(): any;
  onClear?(): any;
}
const SearchBox: FC<SearchInterface> = ({
  searchValue,
  onChange,
  onEndEditing,
  onClear,
}) => {
  const [searchValueText, setSearchValue] = useState('');
  useEffect(() => {
    console.log(searchValue, 'VALUE===');
    setSearchValue(searchValue ? searchValue : '');
  }, [searchValue]);
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer]}>
        <TextInput
          onEndEditing={() => {
            setTimeout(() => {
              if (onEndEditing) {
                onEndEditing();
              }
            }, 500);
          }}
          returnKeyLabel="Search"
          value={searchValueText}
          scrollEnabled={false}
          onChangeText={text => {
            setSearchValue(text);
            onChange(text);
          }}
          returnKeyType="done"
          placeholderTextColor={Colors.placeholderColor}
          style={[styles.textInput]}
          placeholder={'Search'}
        />
        {searchValueText && onClear ? (
          <TouchableOpacity
            onPress={() => {
              if (onClear) {
                onClear();
              }

              Keyboard.dismiss();
            }}
            style={styles.closeIconContainer}>
            <Icon
              size={getHeight(43)}
              color={Colors.placeholderColor}
              iconName={'closecircleo'}
              family={'AntDesign'}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            if (onEndEditing) {
              onEndEditing();
            }
            Keyboard.dismiss();
          }}
          style={styles.iconContainer}>
          <Icon
            size={getHeight(43)}
            color={Colors.placeholderColor}
            iconName={'search'}
            family={'FontAwesome'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBox;
