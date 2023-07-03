/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  Home,
  Profile,
  TemplatesAndSetup,
  EquipmentModelForm,
  EquipmentModelDetails,
  PartsAndMaterialsForm,
  PartsAndMaterialsDetails,
  CompanyForm,
  Users,
  DealerForm,
  CompanyOperatorForm,
  CompanyTechnicianForm,
  CompanyOwnerForm,
  DealerTechnicianForm,
  AssignClients,
  DealerClientForm,
  ResetPassword,
  ServiceIntervalForm,
  ServiceIntervalDetails,
  ServiceTaskForm,
  ServiceTemplateForm,
  ServiceTemplateDetails,
  AttachmentDetails,
} from '../screens';
import {BackHandler, SafeAreaView, StatusBar} from 'react-native';
import Colors from '../theme/Colors';
import {Header} from '../components';
import LinearGradient from 'react-native-linear-gradient';
import CommonStyles from '../theme/CommonStyles';
import CustomDrawer from './CustomDrawer';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import EquipmentStack from './EquipmentStack';
import {useAlert} from '../utils/hooks';
import PreventiveStack from './PreventiveStack';
import ServiceTaskNavigation from './ServiceTaskNavigation';
const Drawer = createDrawerNavigator();

const MainNavigation = () => {
  const {Alert, showAlert} = useAlert();
  const setHeader = (props: any) => {
    return <Header {...props} />;
  };
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  useEffect(() => {
    const backAction = () => {
      showAlert('Hold on!', 'Are you sure you want to exit the app?', [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        {
          text: 'Confirm',
          onPress: async () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const getInitialRoute = (role: string) => {
    switch (role) {
      case 'sAdmin':
        return 'USERS';
      case 'dOwner':
        return 'USERS';
      case 'cOperator':
        return 'PROFILE';
      case 'dTecnician':
        return 'PROFILE';
      default:
        return 'PREVENTIVE_MAINTENANCE';
    }
  };
  return (
    <LinearGradient
      colors={[Colors.appYellow, Colors.white]}
      style={CommonStyles.containerFlex1}>
      <SafeAreaView style={CommonStyles.containerFlex1}>
        <StatusBar
          barStyle={'dark-content'}
          translucent={false}
          backgroundColor={Colors.appYellow}
        />
        <Drawer.Navigator
          screenOptions={{header: props => setHeader(props)}}
          initialRouteName={getInitialRoute(roleType)}
          drawerContent={props => {
            return <CustomDrawer {...props} />;
          }}>
          {roleType !== 'sAdmin' && roleType !== 'dOwner' ? (
            <>
              <Drawer.Screen
                name="ATTACHMENT_DETAILS"
                component={AttachmentDetails}
              />
              <Drawer.Screen
                name="EQUIPMENT_STACK"
                component={EquipmentStack}
              />
              <Drawer.Screen
                name="PREVENTIVE_MAINTENANCE"
                component={PreventiveStack}
              />
            </>
          ) : null}
          {roleType === 'sAdmin' ||
          roleType === 'dOwner' ||
          roleType === 'cOwner' ? (
            <>
              <Drawer.Screen
                name="TEMPLATES_AND_SETUP"
                component={TemplatesAndSetup}
              />
              <Drawer.Screen name="USERS" component={Users} />

              <Drawer.Screen name="COMPANY_FORM" component={CompanyForm} />
              <Drawer.Screen name="DEALER_FORM" component={DealerForm} />
              <Drawer.Screen
                name="COMPANY_OPERATOR_FORM"
                component={CompanyOperatorForm}
              />
              <Drawer.Screen
                name="COMPANY_OWNER_FORM"
                component={CompanyOwnerForm}
              />
              <Drawer.Screen
                name="COMPANY_TECHNICIAN_FORM"
                component={CompanyTechnicianForm}
              />
              <Drawer.Screen
                name="DEALER_TECHNICIAN_FORM"
                component={DealerTechnicianForm}
              />
              <Drawer.Screen
                name="DEALER_CLIENT_FORM"
                component={DealerClientForm}
              />
              <Drawer.Screen
                name="ASSIGN_DEALER_CLIENTS"
                component={AssignClients}
              />

              <Drawer.Screen
                name="EQUIPMENT_MODEL_FORM"
                component={EquipmentModelForm}
              />
              <Drawer.Screen
                name="SERVICE_INTERVAL_FORM"
                component={ServiceIntervalForm}
              />
              <Drawer.Screen
                name="SERVICE_INTERVAL_DETAILS"
                component={ServiceIntervalDetails}
              />
              <Drawer.Screen
                name="SERVICE_TASK_FORM"
                component={ServiceTaskForm}
              />
              <Drawer.Screen
                name="SERVICE_TASK_DETAILS"
                component={ServiceTaskNavigation}
              />
              <Drawer.Screen
                name="SERVICE_TEMPLATE_DETAILS"
                component={ServiceTemplateDetails}
              />
              <Drawer.Screen
                name="SERVICE_TEMPLATE_FORM"
                component={ServiceTemplateForm}
              />
              <Drawer.Screen
                name="PARTS_FORM"
                component={PartsAndMaterialsForm}
              />
              <Drawer.Screen
                name="EQUIPMENT_MODEL_DETAILS"
                component={EquipmentModelDetails}
              />
              <Drawer.Screen
                name="PARTS_DETAILS"
                component={PartsAndMaterialsDetails}
              />
              <Drawer.Screen name="HOME" component={Home} />
            </>
          ) : null}
          <Drawer.Screen name="RESET_PWD" component={ResetPassword} />
          <Drawer.Screen name="PROFILE" component={Profile} />
          <Drawer.Screen name="MAIN" component={MainNavigation} />
        </Drawer.Navigator>
      </SafeAreaView>
      <Alert />
    </LinearGradient>
  );
};
export default MainNavigation;
