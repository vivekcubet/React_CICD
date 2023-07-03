import axios from 'axios';
import {store} from '../redux/store';
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {updateAccessToken} from '../redux/reducers/GlobalReducer';

// Create a new instance of Axios
const api = axios.create({
  // baseURL: 'https://serviceconnection-api.cubettech.in/api/v1', //Staging
  baseURL: 'https://dev-serviceconnection-api.cubettech.in/api/v1', //Dev
  // baseURL: 'https://development-api.serviceconnections.ca/api/v1', //Client Dev
  // timeout: 180000,
});

// Add a request interceptor
api.interceptors.request.use(
  async config => {
    // Check for internet connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      // Show an alert if the device is not connected to the internet\
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
      );
      throw new Error('No internet connection');
    }

    // Add the access token to the request headers
    const accessToken = store.getState().globalReducer.accessToken;
    // config.headers['Content-Type'] = 'multipart/form-data';
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    // Handle any errors that occur during the request
    return Promise.reject(error);
  },
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    // Handle the response data here
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const {refreshToken} = store.getState()?.globalReducer;

    // Check if the error status code is 401 and there is a refresh token available
    if (error.response && error.response.status === 401 && refreshToken) {
      // Use the refresh token to get a new access token
      const response = await axios.post(
        'https://example.com/api/refresh-token',
        {
          refreshToken,
        },
      );
      const {accessToken} = response?.data;

      // Update the access token in the authStore
      store.dispatch(updateAccessToken({accessToken}));

      // Update the Authorization header in the original request with the new access token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Resend the original request with the new access token
      return api(originalRequest);
    } else if (error.response && error.response.status === 404) {
      // Handle a 404 error here
      console.log('The resource you requested was not found.');
      return Promise.reject(error);
    }

    // Handle any other errors that occur in the response
    return Promise.reject(error);
  },
);

export default api;
