/* eslint-disable react/no-unstable-nested-components */
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {DrawerItem} from '@react-navigation/drawer';
import styles from './styles';
import screens from '../screens';
import {clearUserSession} from '../../utils/helpers/securedStorage';
import useLogoutHook from '../../Api/hooks/useLogoutHook';
import {CompanySwitchModal, Icon} from '../../components';
import Colors from '../../theme/Colors';
import {getHeight} from '../../theme/Constants';
import images from '../../assets/images';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import SvgIcon from '../../assets/Icons/SvgIcon';
import {
  updateDealerCompanies,
  updateDealerCompany,
} from '../../redux/reducers/AuthReducer';
import {END_POINTS} from '../../Api/constants';
import useGetApi from '../../Api/hooks/useGetApi';
import FastImage from 'react-native-fast-image';
import {useToast} from 'react-native-toast-notifications';
import {useAlert} from '../../utils/hooks';

const CustomDrawer = ({navigation}: any) => {
  const {Alert, showAlert} = useAlert();
  const toast = useToast();
  const {
    userCompany,
    dealerCompanies,
    dealerCompany,
    roleType,
    loginUser,
    user,
  } = useSelector((state: RootState) => state.AuthReducer);
  const {dailyCheckList, repairOfflineList, serviceOfflineList} = useSelector(
    (state: RootState) => state.OfflineReducer,
  );
  const [get] = useGetApi();
  const dispatch = useDispatch();
  const [isClientOpen, setClientOpen] = useState(false);
  const logOut = useLogoutHook();
  const onLogOut = async () => {
    showAlert('Logout', 'Are you sure you want to log out?', [
      {text: 'CANCEL', onPress: () => null},
      {
        text: 'LOG OUT',
        onPress: async () => {
          await clearUserSession();
          logOut();
          navigation.replace(screens.onBoarding);
        },
      },
    ]);
  };

  const switchUser = async (value: any) => {
    if (value !== '0') {
      let selected = dealerCompanies.find(
        (obj: any) => obj.id.toString() === value?.toString(),
      );
      let company = {
        company: selected,
        company_id: selected?.id,
      };
      toast.show('Acting as company ' + company?.company?.name);
      console.log(company, 'COMPANY DATA');
      dispatch(
        updateDealerCompany({
          selectedCompany: company,
          role: {
            id: 2,
            name:
              loginUser?.roleType === 'dTecnician'
                ? 'Company Owner'
                : 'Company Technician',
            type:
              loginUser?.roleType === 'dTecnician' ? 'cTecnician' : 'cOwner',
            is_active: true,
          },
        }),
      );
      navigation.navigate(screens.preventiveMaintenance);
    } else {
      toast.show(
        loginUser?.roleType === 'dTecnician'
          ? 'Acting as Dealer Tecnician'
          : 'Acting as Dealer',
      );
      dispatch(
        updateDealerCompany({
          selectedCompany: dealerCompany,
          role: {
            id: 5,
            name:
              loginUser?.roleType === 'dTecnician'
                ? 'Dealer Technician'
                : 'Dealer Owner',
            type:
              loginUser?.roleType === 'dTecnician' ? 'dTecnician' : 'dOwner',
            is_active: true,
          },
        }),
      );
      navigation.navigate(
        loginUser?.roleType === 'dTecnician' ? screens.profile : screens.users,
      );
    }
  };
  const updateDealerClientList = async () => {
    console.log(dealerCompany, 'DEALER ');
    const response = await get({
      endPoint:
        END_POINTS.GET_DEALER_CLIENTS + '?id=' + dealerCompany?.company_id,
      params: {},
      isLoader: true,
    });
    if (response?.status) {
      dispatch(updateDealerCompanies({companies: response?.data}));
    }
  };
  const switchAccount = async () => {
    await updateDealerClientList();
    console.log(user, 'USER====');
    setClientOpen(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <DrawerContentScrollView contentContainerStyle={styles.container}> */}
      <View style={styles.mainContainer}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          pinchGestureEnabled={false}
          contentContainerStyle={{
            zIndex: 9999,
          }}>
          <View style={styles.topContainer}>
            <View style={styles.notificationContainer}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.closeDrawer()}
                style={styles.backIconContainer}>
                <Icon
                  color={Colors.appYellow}
                  iconName="chevron-left"
                  family="Entypo"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onLogOut().catch((error: any) => {
                    console.log(error?.message);
                    // Handle the error appropriately
                  });
                }}>
                {/* <Icon
                size={getHeight(30)}
                color={Colors.black}
                iconName="bell"
                family="Feather"
              /> */}
                <Icon
                  size={getHeight(30)}
                  color={Colors.black}
                  iconName="md-exit-outline"
                  family="Ionicons"
                />
              </TouchableOpacity>
            </View>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              style={styles.proImage}
              source={user?.logo ? {uri: user?.logo} : images.pro_img}
            />
            <Text numberOfLines={2} style={styles.userName}>
              {user?.name}
            </Text>
          </View>
          {dealerCompany || roleType === 'dTecnician' ? (
            <DrawerItem
              label={'Switch account '}
              icon={() => {
                return <SvgIcon.DealerLink />;
              }}
              style={styles.itemContainer}
              labelStyle={styles.drawerItemTextStyle}
              onPress={async () => {
                await switchAccount();
              }}
            />
          ) : null}
          {dailyCheckList.length > 0 ||
          repairOfflineList.length > 0 ||
          serviceOfflineList.length > 0 ? (
            <DrawerItem
              style={styles.itemContainer}
              label={'UnSynced data '}
              labelStyle={styles.drawerItemTextStyle}
              onPress={() => {
                navigation.navigate(screens.preventiveMaintenance, {
                  screen: screens.offlineSync,
                });
              }}
              icon={() => {
                return (
                  <Icon
                    color={Colors.black}
                    size={22}
                    iconName="sync"
                    family="Ionicons"
                  />
                );
              }}
            />
          ) : null}
          {roleType !== 'sAdmin' &&
          roleType !== 'dOwner' &&
          roleType !== 'cOperator' &&
          roleType !== 'dTecnician' ? (
            <>
              <DrawerItem
                label={'Preventative Maintenance'}
                icon={() => {
                  return <SvgIcon.Maintenance />;
                }}
                style={styles.itemContainer}
                labelStyle={styles.drawerItemTextStyle}
                onPress={() => {
                  navigation.navigate(screens.preventiveMaintenance, {
                    screen: screens.preventiveMaintenance,
                  });
                }}
              />
              <DrawerItem
                label={'Equipment List'}
                icon={() => {
                  return <SvgIcon.Equipment />;
                }}
                style={styles.itemContainer}
                labelStyle={styles.drawerItemTextStyle}
                onPress={() => {
                  navigation.navigate(screens.equipment, {
                    screen: screens.equipmentList,
                  });
                }}
              />
            </>
          ) : null}
          {roleType === 'sAdmin' ||
          roleType === 'cOwner' ||
          roleType === 'dOwner' ? (
            <>
              {roleType === 'sAdmin' ? (
                <>
                  <DrawerItem
                    label={'Companies '}
                    icon={() => {
                      return <SvgIcon.Companies />;
                    }}
                    style={styles.itemContainer}
                    labelStyle={styles.drawerItemTextStyle}
                    onPress={() => {
                      navigation.navigate(screens.users, {type: 'cOwner'});
                    }}
                  />
                  <DrawerItem
                    label={'Dealers '}
                    icon={() => {
                      return <SvgIcon.Dealers />;
                    }}
                    style={styles.itemContainer}
                    labelStyle={styles.drawerItemTextStyle}
                    onPress={() => {
                      navigation.navigate(screens.users, {type: 'dOwner'});
                    }}
                  />
                </>
              ) : (
                <DrawerItem
                  label={'Users '}
                  icon={() => {
                    return <SvgIcon.Users />;
                  }}
                  style={styles.itemContainer}
                  labelStyle={styles.drawerItemTextStyle}
                  onPress={() => {
                    navigation.navigate(screens.users);
                  }}
                />
              )}
              {roleType === 'sAdmin' || roleType === 'cOwner' ? (
                <DrawerItem
                  icon={() => {
                    return <SvgIcon.TemplateMenu />;
                  }}
                  style={styles.itemContainer}
                  label={'Service Templates & Setup'}
                  labelStyle={styles.drawerItemTextStyle}
                  onPress={() => {
                    navigation.navigate(screens.templatesAndSetup);
                  }}
                />
              ) : null}
            </>
          ) : null}
          {roleType !== 'sAdmin' ? (
            <>
              {dealerCompany && roleType === 'cOwner' ? null : (
                <DrawerItem
                  style={styles.itemContainer}
                  label={'Profile '}
                  labelStyle={styles.drawerItemTextStyle}
                  onPress={() => {
                    navigation.navigate(screens.profile);
                  }}
                  icon={() => {
                    return (
                      <Icon
                        color={Colors.black}
                        size={22}
                        iconName="user"
                        family="AntDesign"
                      />
                    );
                  }}
                />
              )}
            </>
          ) : null}
          {roleType.toString() === 'cOwner' ||
          roleType.toString() === 'dOwner' ? (
            <DrawerItem
              style={styles.itemContainer}
              label={
                roleType.toString() === 'dOwner'
                  ? 'Dealer profile '
                  : 'Company profile '
              }
              labelStyle={styles.drawerItemTextStyle}
              onPress={() => {
                navigation.navigate(screens.profile, {isCompany: true});
              }}
              icon={() => {
                return (
                  <Icon
                    color={Colors.black}
                    size={22}
                    iconName="building-o"
                    family="FontAwesome"
                  />
                );
              }}
            />
          ) : null}
          <DrawerItem
            icon={() => {
              return (
                <Icon
                  color={Colors.black}
                  size={22}
                  iconName="key-outline"
                  family="Ionicons"
                />
              );
            }}
            style={styles.itemContainer}
            label={'Password reset'}
            labelStyle={styles.drawerItemTextStyle}
            onPress={() => {
              navigation.navigate(screens.resetPassword, {
                isFromLogin: true,
                email: user.email,
              });
            }}
          />
          <DrawerItem
            icon={() => {
              return (
                <Icon
                  color={Colors.black}
                  size={22}
                  iconName="md-exit-outline"
                  family="Ionicons"
                />
              );
            }}
            style={styles.itemContainer}
            label={'Logout'}
            labelStyle={styles.drawerItemTextStyle}
            onPress={() => {
              onLogOut().catch((error: any) => {
                console.log(error?.message);
                // Handle the error appropriately
              });
            }}
          />
          {/* <Text style={{color: 'rgba(0,0,0,0.015)', alignSelf: 'center'}}>
            {string.app}
          </Text>
          <Text style={{color: 'rgba(0,0,0,0.015)', alignSelf: 'center'}}>
            {string.version}
          </Text> */}
        </ScrollView>
      </View>
      {/* </DrawerContentScrollView> */}

      <CompanySwitchModal
        onClose={() => {
          setClientOpen(false);
        }}
        isOpen={isClientOpen}
        onChange={async (value: any) => {
          await switchUser(value);
        }}
        value={
          userCompany?.company_id ? userCompany?.company_id.toString() : '0'
        }
        listFirstItems={[
          {
            label:
              loginUser?.roleType === 'dTecnician'
                ? 'Dealer Technician'
                : 'Dealer',
            value: '0',
          },
        ]}
        items={[
          ...(dealerCompanies
            ? dealerCompanies.map((obj: any) => {
                return {label: obj.name, value: obj.id.toString()};
              })
            : []),
        ]}
      />
      <Alert />
    </SafeAreaView>
  );
};

export default CustomDrawer;
