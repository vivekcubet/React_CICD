import {useEffect, useState} from 'react';
import {END_POINTS} from '../constants';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import usePostApi from './usePostApi';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {storeUserSession} from '../../utils/helpers/securedStorage';
import {updateUser} from '../../redux/reducers/AuthReducer';
import screens from '../../navigation/screens';
import {useDispatch} from 'react-redux';
import {RoleInterface, UserInterface} from '../../types/userTypes';
import {updateAccessToken} from '../../redux/reducers/GlobalReducer';
import {useToast} from 'react-native-toast-notifications';
import useGetApi from './useGetApi';
import {updateDealerCompanies} from '../../redux/reducers/AuthReducer';
export interface LoginInterface {
  email: string;
  password: string;
}

interface LoginResponse {
  data: any;
  // Define the expected response properties here
}

const useLogin = (): [
  (data: LoginInterface) => Promise<LoginResponse>,
  {errors: any | null},
] => {
  const [errors, setError] = useState<any | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [postApi, {error}] = usePostApi();
  const [get] = useGetApi();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    setError(error);
  }, [error]);
  const signup = async (data: LoginInterface) => {
    toast.hideAll();
    const response = await postApi({
      endPoint:
        END_POINTS.LOGIN +
        '?email=' +
        data.email +
        '&password=' +
        data.password,
      params: {},
    });
    if (response) {
      if (response?.data?.user) {
        let {user} = response?.data;
        console.log(user, 'USER====', response);
        dispatch(updateAccessToken({accessToken: user?.token}));
        await storeUserSession({
          accessToken: user?.token,
          refreshToken: '',
        });
        let userData: UserInterface = {
          name: user?.name,
          email: user.email,
          id: user?.user_company?.user_id,
          logo: user?.logo,
        };
        let userRole: RoleInterface = {
          id: user?.role?.id,
          name: user?.role?.name,
          type: user?.role?.type,
          is_active: user?.role.is_active,
        };
        console.log(user?.user_company, 'USER COMPANY===', user?.role?.type);
        let userCompany = user?.user_company;
        if (
          user?.role?.type === 'dOwner' ||
          user?.role?.type === 'dTecnician'
        ) {
          // userCompany.name;
          let res = await getDealerClientList(userCompany?.company_id);
          if (res) {
            await dispatch(updateDealerCompanies({companies: res}));
          }
          console.log(res, 'DCLIST====');
        }
        await dispatch(updateUser({userData, userRole, userCompany}));
        if (user.set_password === 0) {
          navigation.navigate(screens.resetPassword, {
            isFromLogin: true,
            email: user?.email,
            current_password: data.password,
          });
        } else {
          navigation.replace(screens.main);
        }
      } else if (response?.code === 400 && response?.message) {
        toast.show(response?.message);
      }
      return response.results;
    }
  };
  const getDealerClientList = async (id: any) => {
    const response = await get({
      endPoint: END_POINTS.GET_DEALER_CLIENTS + '?id=' + id,
      params: {},
      isLoader: true,
    });
    if (response?.status) {
      return response?.data;
    }
  };
  return [signup, {errors}];
};

export default useLogin;
