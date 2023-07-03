import React, {useState} from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../theme/Colors';
import {StyleSheet} from 'react-native';
import {getHeight} from '../../theme/Constants';

const useAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<any>([]);

  const showAlert = (title: any, message: any, buttons: any = []) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons);
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const Alert = () => (
    <AwesomeAlert
      show={isVisible}
      showProgress={false}
      titleStyle={{fontSize: 20, color: Colors.black}}
      title={alertTitle}
      message={alertMessage}
      messageStyle={{
        fontSize: 18,
        textAlign: 'center',
      }}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={alertButtons[0] ? true : false}
      showConfirmButton={alertButtons[1] ? true : false}
      cancelText={alertButtons[0]?.text ?? 'Cancel'}
      confirmText={alertButtons[1]?.text ?? 'Confirm'}
      cancelButtonStyle={styles.approveButton}
      confirmButtonStyle={styles.approveButton}
      cancelButtonTextStyle={{
        fontWeight: 'bold',
        color: Colors.btnOrange,
        fontSize: getHeight(75),
      }}
      confirmButtonTextStyle={{
        fontWeight: 'bold',
        color: Colors.black,
        fontSize: getHeight(75),
      }}
      confirmButtonColor={Colors.appYellow}
      cancelButtonColor={Colors.white}
      contentContainerStyle={{
        backgroundColor: '#F1F3F7',
        paddingBottom: getHeight(35),
        minWidth: '80%',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
      }}
      onCancelPressed={() => {
        hideAlert();
        const cancelCallback = alertButtons[0]?.onPress;
        if (cancelCallback) {
          cancelCallback();
        }
      }}
      onConfirmPressed={() => {
        hideAlert();
        const confirmCallback = alertButtons[1]?.onPress;
        if (confirmCallback) {
          confirmCallback();
        }
      }}
    />
  );

  return {Alert, showAlert, hideAlert};
};

export default useAlert;
const styles = StyleSheet.create({
  approveButton: {
    width: '30%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
