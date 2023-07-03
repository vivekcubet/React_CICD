/* eslint-disable react-hooks/exhaustive-deps */
import {Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../theme/CommonStyles';
import {DropDown, Icon, SearchBox} from '../../components';
import Colors from '../../theme/Colors';
import {
  CompanyList,
  DealerList,
  CompanyOperatorList,
  CompanyTechnicianList,
  CompanyOwnerList,
  DealerTechnicianList,
  DealerClientList,
} from '../../screens';
import {getHeight} from '../../theme/Constants';
import styles from './styles';
import {getUserPermission} from './userPermission';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const Users = ({route}: any) => {
  const {roleType, userCompany} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const userList: any = getUserPermission(roleType);
  const [availableUsers, setUserList] = useState(getUserPermission(roleType));
  let selected = route?.params?.type
    ? userList.filter((user: any) => user.value.includes(route?.params?.type))
    : null;
  const [searchText, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(
    selected ? selected[0] : userList[0],
  );
  const [finalSearchText, setFinalSearch] = useState('');
  const [userListOpen, setUserOpen] = useState(false);
  console.log(userCompany, 'COMPANY====');
  useEffect(() => {
    let selected = route?.params?.type
      ? userList.filter((user: any) => user.value.includes(route?.params?.type))
      : null;
    setUserList(getUserPermission(roleType));
    console.log(selected, 'first====change===');
    setSelectedUser(selected ? selected[0] : userList[0]);
  }, [roleType, userCompany, route?.params?.type]);
  useEffect(() => {
    setSearch(finalSearchText);
  }, [finalSearchText]);
  const switchUserList = () => {
    switch (selectedUser?.value) {
      case 'cOwner':
        return <CompanyList searchText={finalSearchText} />;
      case 'dOwner':
        return <DealerList searchText={finalSearchText} />;
      case 'cOperator':
        return <CompanyOperatorList searchText={finalSearchText} />;
      case 'cTecnician':
        return <CompanyTechnicianList searchText={finalSearchText} />;
      case 'dTecnician':
        return <DealerTechnicianList searchText={finalSearchText} />;
      case 'dClient':
        return <DealerClientList searchText={finalSearchText} />;
      case 'cOwnerC':
        return <CompanyOwnerList searchText={finalSearchText} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
      <View style={CommonStyles.mainContainer}>
        <SearchBox
          onClear={() => {
            setSearch('');
            setFinalSearch('');
          }}
          onEndEditing={() => {
            setFinalSearch(searchText);
          }}
          onChange={(value: string) => {
            setSearch(value);
          }}
          searchValue={searchText}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{selectedUser?.label}</Text>
          {roleType !== 'sAdmin' ? (
            <TouchableOpacity
              onPress={() => setUserOpen(true)}
              style={styles.selectContainer}>
              <Text
                style={{
                  color: Colors.placeholderColor,
                  fontSize: getHeight(60),
                }}>
                {selectedUser?.label}
              </Text>
              <Icon
                color={Colors.black}
                size={getHeight(65)}
                family="AntDesign"
                iconName="down"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {switchUserList()}
        {/* <CompanyList searchText={finalSearchText} /> */}
        {/* <DealerList searchText={finalSearchText} /> */}

        <DropDown
          isHidden={true}
          onClose={() => setUserOpen(false)}
          isOpen={userListOpen}
          onChange={(value: any) => {
            let selected = availableUsers.filter((user: any) =>
              user.value.includes(value),
            );
            setSelectedUser(selected[0]);
          }}
          value={selectedUser?.value}
          items={availableUsers}
          label=""
        />
      </View>
    </View>
  );
};

export default Users;
