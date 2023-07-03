import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../theme/Colors';
import styles from './styles';
import {DropDown, Icon} from '..';
import {getHeight} from '../../theme/Constants';
import images from '../../assets/images';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {updateDealerCompany} from '../../redux/reducers/AuthReducer';
import FastImage from 'react-native-fast-image';
const Header = ({navigation}: any) => {
  const {userCompany, dealerCompanies, dealerCompany, roleType, loginUser} =
    useSelector((state: RootState) => state.AuthReducer);
  let selectedCompany =
    dealerCompany && loginUser.roleType !== 'dTecnician'
      ? dealerCompany
      : userCompany;
  const {company = {}} = selectedCompany ? selectedCompany : {};
  const {name = null, logo = null} = company ? company : {};
  const dispatch = useDispatch();
  const [isClientOpen, setClientOpen] = useState(false);
  const imgPlaceHolder =
    roleType === 'sAdmin' ? images.logo_placeholder : images.logo_placeholder;
  useEffect(() => {
    console.log(userCompany, 'USERRR==');
  }, [userCompany]);
  return (
    <View style={{backgroundColor: Colors.white}}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            // () => console.log('OKK')
            navigation.openDrawer()
          }
          style={styles.menuBtn}>
          <Icon
            size={getHeight(35)}
            color={Colors.black}
            family="FontAwesome5"
            iconName="bars"
          />
        </TouchableOpacity>
        <View style={[styles.companyContainer, {flex: 2}]}>
          <Text numberOfLines={1} style={styles.companyName}>
            {roleType === 'sAdmin' ? 'Admin' : name}
          </Text>
          <FastImage
            style={styles.companyImage}
            resizeMode={FastImage.resizeMode.cover}
            source={logo ? {uri: logo} : imgPlaceHolder}
          />
        </View>
      </View>
      <DropDown
        isHidden={true}
        onClose={() => setClientOpen(false)}
        isOpen={isClientOpen}
        onChange={(value: any) => {
          let selected = dealerCompanies.find(
            (obj: any) => obj.id.toString() === value?.toString(),
          );
          let company = {
            company: selected,
            company_id: selected.id,
          };
          dispatch(updateDealerCompany(company));
          console.log(company, 'COMPANY DATA');
        }}
        value={userCompany?.company_id}
        items={dealerCompanies?.map((obj: any) => {
          return {label: obj.name, value: obj.id};
        })}
        label="Company"
      />
    </View>
  );
};

export default Header;
