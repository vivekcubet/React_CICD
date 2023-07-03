import EncryptedStorage from 'react-native-encrypted-storage';
interface SessionInterface {
  accessToken?: string;
  refreshToken?: string;
}

export const storeUserSession = async (data: SessionInterface) => {
  try {
    await EncryptedStorage.setItem('user_session', JSON.stringify(data));
    // Congrats! You've just stored your first value!
  } catch (error) {
    console.log('USER SESSION ERROR', error);
    // There was an error on the native side
  }
};

export const retrieveUserSession = async () => {
  try {
    const session = await EncryptedStorage.getItem('user_session');

    if (session !== undefined && session !== null) {
      console.log(session, 'SESSION');
      return JSON.parse(session);
      // Congrats! You've just retrieved your first value!
    } else {
      return null;
    }
  } catch (error) {
    console.log('USER SESSION GET ERROR', error);
    // There was an error on the native side
  }
};

export const storeUserDetails = async (data: any) => {
  try {
    console.log(data, 'USER DETAILS');
    await EncryptedStorage.setItem('user_details', JSON.stringify(data));
    // Congrats! You've just stored your first value!
  } catch (error) {
    console.log('USER DETAILS STORE ERROR', error);
    // There was an error on the native side
  }
};

export const retriveUserDetails = async () => {
  try {
    const userDetails = await EncryptedStorage.getItem('user_details');

    if (userDetails !== undefined && userDetails !== null) {
      console.log(userDetails, 'DETAILS====');
      return JSON.parse(userDetails);
      // Congrats! You've just retrieved your first value!
    } else {
      return null;
    }
  } catch (error) {
    console.log('USER DETAILS GET ERROR', error);
    // There was an error on the native side
  }
};

export const clearUserSession = async () => {
  try {
    await EncryptedStorage.clear();
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    console.log('USER SESSION CLEAR ERROR', error);
    // There was an error on the native side
  }
};
