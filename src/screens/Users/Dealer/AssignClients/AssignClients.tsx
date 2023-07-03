/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {
  BackButton,
  FormButton,
  Icon,
  MultiSelect,
} from '../../../../components';
import styles from './styles';
import {getHeight} from '../../../../theme/Constants';
import {useUpdateDealerClients, useGetCompanyList} from '../../../../Api/hooks';

import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import screens from '../../../../navigation/screens';
import {useAlert} from '../../../../utils/hooks';
import useGetApi from '../../../../Api/hooks/useGetApi';
import {END_POINTS} from '../../../../Api/constants';
import {FlatList} from 'react-native-gesture-handler';
import Colors from '../../../../theme/Colors';

const AssignClients = ({route}: any) => {
  let {dealer = {}} = route?.params;
  const flatListRef = useRef<any>(null);
  const {Alert, showAlert} = useAlert();
  const [getCompanyList] = useGetCompanyList();
  const [get] = useGetApi();
  const [updateDealerClients, {errors: postErrors}] = useUpdateDealerClients();
  const [companies, setCompanies] = useState<any>([]);
  const [newAssigned, setNewAssigned] = useState<any>([]);
  const [oldAssigned, setOldAssigned] = useState<any>([]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  console.log(postErrors);
  useFocusEffect(
    React.useCallback(() => {
      setOldAssigned([]);
      getAllCompanies();
      getDealerClientList();
    }, [dealer]),
  );

  const getAllCompanies = async () => {
    const res = await getCompanyList({
      isLoader: true,
      page: '',
      search: '',
      isAll: true,
    });
    if (!res) {
      return;
    }
    const finalData = res?.map((obj: any) => {
      return {label: obj.name, value: obj.id};
    });
    setCompanies(finalData);
    console.log(finalData, 'RES======Companies');
  };
  useEffect(() => {
    console.log(dealer, 'SELECTED LIST==', newAssigned);
  }, [newAssigned]);

  const getDealerClientList = async () => {
    if (dealer) {
      const response = await get({
        endPoint: END_POINTS.GET_DEALER_CLIENTS + '?id=' + dealer?.id,
        params: {},
        isLoader: true,
      });
      if (response?.status) {
        const finalData = response?.data?.map((obj: any) => {
          return {label: obj.name, value: obj.id};
        });
        console.log(dealer, 'CLIENT LIST', finalData);
        setOldAssigned(finalData);
      }
    }
  };
  const updateDealerClientList = async () => {
    let clientsList = [...newAssigned, ...oldAssigned].map(item => item.value);

    let response = await updateDealerClients({
      client_id: clientsList,
      dealer_id: dealer?.id,
    });
    if (response) {
      setNewAssigned([]);
      getDealerClientList();
    }
  };
  const deleteDealerClient = async (client: any, index: number) => {
    if (!client.isNew) {
      showAlert('Warning', 'Are you sure you want to unlink the company?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Confirm',
          onPress: async () => {
            let response = await updateDealerClients({
              client_id: [client.value],
              dealer_id: dealer?.id,
              isDelete: true,
            });
            if (response) {
              // setNewAssigned([]);
              getDealerClientList();
            }
          },
        },
      ]);
    } else {
      console.log(newAssigned, 'Assigned');
      let newAssigns = [...newAssigned];
      newAssigned.splice(index, 1);
      console.log(newAssigns, 'finnal', index);
      setNewAssigned(
        newAssigned.filter((item: any) => item?.value !== client.value),
      );
    }
  };
  const formComponent = () => {
    return (
      <>
        <View style={styles.detailsItemContainer}>
          <MultiSelect
            isListShow={false}
            onChange={values => {
              const updatedArray = values.map((obj: any) => ({
                ...obj,
                isNew: true,
              }));
              setNewAssigned(updatedArray);
              if (flatListRef?.current) {
                flatListRef.current.scrollToOffset({
                  offset: 0,
                  animated: true,
                });
              }
            }}
            isLabelVisible={false}
            label="Companies"
            selected={newAssigned}
            items={companies.filter(
              (itemA: any) =>
                !oldAssigned.some((itemB: any) => itemA.value === itemB.value),
            )}
          />
          {[...newAssigned, ...oldAssigned].length > 0 ? (
            <Text
              style={{
                fontSize: getHeight(45),
                color: Colors.black,
                marginBottom: getHeight(45),
              }}>
              Companies ( {[...newAssigned, ...oldAssigned].length} )
            </Text>
          ) : null}
          <FlatList
            ref={flatListRef}
            data={[...newAssigned, ...oldAssigned]}
            contentContainerStyle={{
              paddingBottom: newAssigned.length > 0 ? 0 : 150,
            }}
            renderItem={({item, index}) => {
              return (
                <View style={[styles.itemView]}>
                  <Text numberOfLines={2} style={styles.listText}>
                    {item.label}
                    {item?.isNew ? ' ' : ''}
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteDealerClient(item, index)}
                    style={[
                      styles.listDelete,
                      {
                        backgroundColor: item?.isNew
                          ? Colors.formBackground
                          : Colors.errorColor,
                      },
                    ]}>
                    <Icon
                      color={item?.isNew ? Colors.black : Colors.white}
                      iconName={item?.isNew ? 'close' : 'trash-can-outline'}
                      size={getHeight(45)}
                      family="MaterialCommunityIcons"
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          {newAssigned.length > 0 ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{height: '12%'}}>
              <FormButton
                isYellow={true}
                onPress={() => updateDealerClientList()}
                label={'Save'}
              />
            </View>
          ) : null}
        </View>
      </>
    );
  };
  return (
    <>
      <View style={CommonStyles.mainContainer}>
        <BackButton
          onPress={() => {
            if (newAssigned.length > 0) {
              showAlert(
                'Warning',
                'You have unsaved data, are you sure you want to Continue?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                  },
                  {
                    text: 'Confirm',
                    onPress: async () => {
                      setNewAssigned([]);
                      setOldAssigned([]);
                      navigation.navigate(screens.users, {type: 'dOwner'});
                    },
                  },
                ],
              );
            } else {
              navigation.navigate(screens.users, {type: 'dOwner'});
            }
          }}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Assign Companies</Text>
        </View>

        <View
          style={[
            CommonStyles.containerFlex1,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              paddingBottom: newAssigned.length > 0 ? 120 : 0,
            },
          ]}>
          {formComponent()}
        </View>
      </View>
      <Alert />
    </>
  );
};

export default AssignClients;
