/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, Modal, SafeAreaView} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import {FormButton, Icon, SearchBox} from '..';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {FlatList} from 'react-native-gesture-handler';
import {getHeight} from '../../theme/Constants';
import SvgIcon from '../../assets/Icons/SvgIcon';
export interface ItemInterface {
  label: string;
  value: string;
}
interface MultiSelectInterface {
  label: string;
  selected: any[];
  items: ItemInterface[];
  onChange(value: any): any;
  error?: string;
  isLabelVisible?: boolean;
  isOpen?: boolean;
  onClose?(): any;
  isHidden?: boolean;
  removeItem?: any;
  isListShow?: boolean;
}
const MultiSelect: FC<MultiSelectInterface> = ({
  selected = [],
  items,
  label,
  error,
  onChange,
  isOpen = false,
  onClose,
  isHidden = false,
  removeItem,
  isListShow = true,
  isLabelVisible = true,
}) => {
  const [open, setOpen] = useState<any>(false);
  const [selectedValues, setValues] = useState<any>(selected);
  const [listItems, setItems] = useState([...items]);
  const [searchText, setSearch] = useState('');
  useEffect(() => {
    console.log(selected, 'TES==========');
    setItems(items);
    setValues(selected);
  }, [items, selected, isOpen]);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    let searchItems = items.filter(obj =>
      obj.label.toUpperCase().includes(searchText.toUpperCase()),
    );
    setItems(searchItems);
  }, [searchText, isOpen]);
  const updateSelection = (item: any) => {
    let myArray = [...selectedValues];
    const index = selectedValues.findIndex(
      (obj: any) => obj.value === item.value,
    );

    if (index !== -1) {
      myArray.splice(index, 1);
    } else {
      myArray.push(item);
    }
    console.log(myArray, 'SELECTED');
    setValues(myArray);
  };

  return (
    <>
      {!isHidden ? (
        <View style={styles.container}>
          {isLabelVisible ? <Text style={styles.label}>{label}</Text> : null}
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setOpen(!open);
            }}
            style={styles.dropdownContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                {
                  color: Colors.placeholderColor,
                },
              ]}>
              {'Select ' + label}
            </Text>
            <View style={styles.iconContainer}>
              <Icon
                color={Colors.black}
                family="Feather"
                iconName="chevron-down"
              />
            </View>
          </TouchableOpacity>
          {isListShow ? (
            <>
              {selected.length > 0 ? (
                <View style={styles.selectedContainer}>
                  {selected.map((item: any, index: any) => {
                    return (
                      <View
                        key={item?.value.toString()}
                        style={styles.selectedTagContainer}>
                        <Text
                          style={{
                            marginRight: getHeight(25),
                            fontSize: getHeight(55),
                          }}>
                          {item?.label}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            if (removeItem) {
                              removeItem(index);
                            }
                          }}>
                          <Icon
                            color={Colors.black}
                            iconName={'close'}
                            size={getHeight(45)}
                            family="MaterialCommunityIcons"
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </>
          ) : null}
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
          setItems(items);
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
                    setItems(items);
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
              {/* {isListShow ? ( */}
              <FlatList
                data={listItems}
                renderItem={({item}) => {
                  const isObjectInArray = selectedValues.some(
                    (obj: any) => obj.value === item?.value,
                  );
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        updateSelection(item);
                      }}
                      style={styles.itemView}>
                      <Text numberOfLines={2} style={styles.listText}>
                        {item?.label}
                      </Text>
                      <SvgIcon.SelectSquare
                        fill={isObjectInArray ? Colors.black : Colors.white}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              {/* // ) : null} */}
              <View
                style={{
                  height: getHeight(20),
                  marginTop: getHeight(40),
                  backgroundColor: Colors.appYellow,
                }}>
                <FormButton
                  isYellow={true}
                  onPress={() => {
                    onChange(selectedValues);
                    setItems(items);
                    setOpen(false);
                  }}
                  label={'Confirm'}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

export default MultiSelect;
