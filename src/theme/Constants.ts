import {Dimensions} from 'react-native';
export const getHeight = (percent: number) => {
  return percent === 0 ? 0 : Dimensions.get('window').height / percent;
};

export const getWidth = (percent: number) => {
  return percent === 0 ? 0 : Dimensions.get('window').width / percent;
};
