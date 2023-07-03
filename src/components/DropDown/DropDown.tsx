/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, Modal, SafeAreaView} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import {Icon, SearchBox} from '../../components';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {FlatList} from 'react-native-gesture-handler';
import {getHeight} from '../../theme/Constants';
import SvgIcon from '../../assets/Icons/SvgIcon';
export interface ItemInterface {
  label: string;
  value: string;
}
interface DropDownInterface {
  label: string;
  value: string;
  items: ItemInterface[];
  onChange(value: string): any;
  error?: string;
  isOpen?: boolean;
  onClose?(): any;
  setTouched?(): any;
  isHidden?: boolean;
  listFirstItems?: ItemInterface[];
  disabled?: boolean;
}
const DropDown: FC<DropDownInterface> = ({
  value = '',
  items,
  label,
  error,
  onChange,
  isOpen = false,
  onClose,
  isHidden = false,
  listFirstItems = [],
  setTouched,
  disabled = false,
}) => {
  const [open, setOpen] = useState<any>(false);
  const [selectedValue, setValue] = useState<any>(value);
  const [listItems, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);
  const [searchText, setSearch] = useState('');
  useEffect(() => {
    setItems(items);
    setValue(value);
  }, [items, value]);
  useEffect(() => {
    let searchItems = items.filter(obj =>
      obj.label
        .toString()
        .toUpperCase()
        .includes(searchText.toString().toUpperCase()),
    );
    setItems(searchItems);
  }, [searchText, isOpen]);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <>
      {!isHidden ? (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity
            activeOpacity={disabled ? 1 : 0.5}
            onPress={() => {
              setSearch('');
              if (!disabled) {
                if (setTouched) {
                  setTouched();
                }
                setOpen(!open);
              }
            }}
            style={styles.dropdownContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                {color: selectedValue ? Colors.black : Colors.placeholderColor},
              ]}>
              {selectedValue
                ? listItems.find(
                    item => item.value.toString() === selectedValue.toString(),
                  )?.label
                : 'Select an item'}
            </Text>
            {!disabled ? (
              <View style={styles.iconContainer}>
                <Icon
                  color={Colors.black}
                  family="Feather"
                  iconName="chevron-down"
                />
              </View>
            ) : null}
          </TouchableOpacity>
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
        </View>
      ) : null}
      <Modal
        onRequestClose={() => {
          if (onClose) {
            onClose();
          }
          setOpen(false);
        }}
        visible={open}
        transparent>
        <View
          style={[
            {backgroundColor: Colors.transparentBlack},
            CommonStyles.containerFlex1,
          ]}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.mainContainer}>
              <View style={styles.closeContainer}>
                <Text style={styles.modalTitle}>Select {label}</Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => {
                    setSearch('');
                    if (onClose) {
                      onClose();
                    }
                    setOpen(false);
                  }}>
                  <Icon
                    color={Colors.black}
                    family="AntDesign"
                    iconName="closecircleo"
                  />
                </TouchableOpacity>
              </View>
              <SearchBox
                searchValue={searchText}
                onClear={() => setSearch('')}
                // onEndEditing={() => null}
                onChange={(text: string) => setSearch(text)}
              />
              <FlatList
                data={[...listFirstItems, ...listItems]}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (onClose) {
                          onClose();
                        }
                        onChange(item?.value);
                        setValue(item?.value);
                        setOpen(false);
                      }}
                      style={styles.itemView}>
                      <Text numberOfLines={2} style={styles.listText}>
                        {item.label}
                      </Text>
                      <SvgIcon.CheckBox
                        // height={getHeight(15)}
                        // width={getHeight(15)}
                        fill={
                          selectedValue?.toString() === item?.value?.toString()
                            ? Colors.black
                            : Colors.white
                        }
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

export default DropDown;
