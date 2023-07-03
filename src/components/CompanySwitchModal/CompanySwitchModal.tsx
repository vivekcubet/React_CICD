import {View, Text, TouchableOpacity, Modal, SafeAreaView} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import {Icon} from '../../components';
import Colors from '../../theme/Colors';
import CommonStyles from '../../theme/CommonStyles';
import {FlatList} from 'react-native-gesture-handler';
import SvgIcon from '../../assets/Icons/SvgIcon';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {getHeight, getWidth} from '../../theme/Constants';
import SwitchSelector from 'react-native-switch-selector';
export interface ItemInterface {
  label: string;
  value: string;
}
interface DropDownInterface {
  value: string;
  items: ItemInterface[];
  onChange(value: string): any;
  error?: string;
  isOpen?: boolean;
  onClose?(): any;
  listFirstItems?: ItemInterface[];
}
const CompanySwitchModal: FC<DropDownInterface> = ({
  value = '',
  items,
  onChange,
  isOpen = false,
  onClose,
  listFirstItems = [],
}) => {
  const [open, setOpen] = useState<any>(false);
  const [selectedValue, setValue] = useState<any>(value);
  const {roleType, loginUser} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const [listItems, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);
  const [switchValue, ChangeSwitch] = useState<any>(roleType);
  useEffect(() => {
    console.log(value, 'TES==========');
    setItems(items);
    setValue(value);
  }, [items, value]);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    ChangeSwitch(roleType);
  }, [roleType, isOpen]);
  return (
    <>
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
          <SafeAreaView style={[styles.modalContainer]}>
            <View style={styles.mainContainer}>
              <View style={styles.closeContainer}>
                <Text style={styles.modalTitle}>Switch Account</Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => {
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
              <View style={{alignItems: 'flex-end'}}>
                <View style={{width: getWidth(2.5), height: getHeight(14)}}>
                  <SwitchSelector
                    initial={
                      switchValue === 'dOwner' || switchValue === 'dTecnician'
                        ? 0
                        : 1
                    }
                    onPress={(changeValue: any) => {
                      ChangeSwitch(changeValue.toString());
                      if (
                        changeValue === 'dOwner' ||
                        changeValue === 'dTecnician'
                      ) {
                        if (onClose) {
                          onClose();
                        }
                        onChange(listFirstItems[0]?.value);
                        setValue(listFirstItems[0]?.value);
                        setOpen(false);
                      }
                    }}
                    height={getHeight(30)}
                    textColor={Colors.black} //'#7a44cf'
                    selectedColor={Colors.white}
                    buttonColor={'#7a44cf'}
                    borderColor={Colors.placeholderColor}
                    hasPadding
                    options={[
                      {label: 'Dealer', value: 'dOwner'}, //images.feminino = require('./path_to/assets/img/feminino.png')
                      {
                        label: 'Company',
                        value: 'cOwner',
                      }, //images.masculino = require('./path_to/assets/img/masculino.png')
                    ]}
                    testID="gender-switch-selector"
                    accessibilityLabel="gender-switch-selector"
                  />
                </View>
              </View>
              {switchValue === 'cOwner' || switchValue === 'cTecnician' ? (
                <FlatList
                  data={[...listItems]}
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
                        <SvgIcon.SelectSquare
                          // height={getHeight(15)}
                          // width={getHeight(15)}
                          fill={
                            selectedValue === item.value
                              ? Colors.black
                              : Colors.white
                          }
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : null}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

export default CompanySwitchModal;
