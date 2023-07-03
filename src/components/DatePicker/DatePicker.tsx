import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import Colors from '../../theme/Colors';
import {Icon} from '..';
import {getHeight} from '../../theme/Constants';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
interface DropDownInterface {
  value?: string;
  label: string;
  onChange?(value: any): any;
  error?: string;
  isOpen?: boolean;
  onClose?(): any;
  setTouched?(): any;
  isHidden?: boolean;
  disabled?: boolean;
  maxDate?: any;
}
const DatePicker: FC<DropDownInterface> = ({
  value = '',
  label,
  error,
  setTouched,
  disabled = false,
  onChange,
  maxDate = null,
}) => {
  const [date, setDate] = useState<any>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  useEffect(() => {
    setDate(value ? new Date(value) : new Date());
  }, [value]);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any) => {
    console.warn('A date has been picked: ', selectedDate);
    setDate(new Date(selectedDate));
    if (onChange) {
      onChange(new Date(selectedDate));
    }
    hideDatePicker();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.5}
        onPress={() => {
          if (!disabled) {
            if (setTouched) {
              setTouched();
            }
            setDatePickerVisibility(!isDatePickerVisible);
          }
        }}
        style={styles.dropdownContainer}>
        <View style={styles.iconContainer}>
          <Icon
            size={getHeight(45)}
            color={Colors.placeholderColor}
            family="Feather"
            iconName="calendar"
          />
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.text,
            {color: value ? Colors.black : Colors.placeholderColor},
          ]}>
          {moment(date).format('D MMM YYYY')}
        </Text>

        <View style={styles.iconContainer}>
          {!disabled ? (
            <Icon
              color={Colors.black}
              family="Feather"
              iconName="chevron-down"
            />
          ) : null}
        </View>
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
      <DateTimePickerModal
        maximumDate={maxDate}
        date={date}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePicker;
