/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import CommonStyles from '../../theme/CommonStyles';
import images from '../../assets/images';
import styles from './styles';
import {FieldView, Icon, KeyboardAwareScroll} from '../../components';
import Colors from '../../theme/Colors';
import {getHeight, getWidth} from '../../theme/Constants';
import EditProfile from './EditProfile/EditProfile';
import ProfileInterface from './ProfileInterface';
import useGetApi from '../../Api/hooks/useGetApi';
import {END_POINTS} from '../../Api/constants';
import usePostApi from '../../Api/hooks/usePostApi';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {pickImage} from '../../utils/helpers/imagePicker';
import {updateCompany, updateUserData} from '../../redux/reducers/AuthReducer';
import FastImage from 'react-native-fast-image';
const ViewProfile = ({route}: any) => {
  const {user, userCompany, dealerCompany, roleType, loginUser} = useSelector(
    (state: RootState) => state.AuthReducer,
  );
  const dispatch = useDispatch();
  const [get] = useGetApi();
  const [postApi] = usePostApi();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileInterface>({});
  const [image, setImage] = useState<any>(null);
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [route?.params?.isCompany, isEdit, roleType]),
  );
  const loadData = () => {
    if (
      (route?.params?.isCompany ||
        (dealerCompany && (roleType === 'cOwner' || roleType === 'dOwner'))) &&
      userCompany?.company_id
    ) {
      getCompanyProfile();
    } else {
      getProfile();
    }
  };
  const getProfile = async () => {
    if (loginUser?.id) {
      let profileResponce = await postApi({
        endPoint: END_POINTS.GET_PROFILE_ID,
        params: {id: loginUser?.id},
      });
      console.log(user, 'PRO RESPONCE====', END_POINTS.GET_PROFILE);
      if (profileResponce?.data) {
        let {data} = profileResponce;

        setProfileData({
          id: loginUser?.id,
          // company: data?.company,
          name: data?.name,
          phone_number: data?.phone_number,
          address: data?.address,
          email: data?.email,
          logo: data?.logo,
        });

        if (dealerCompany && (roleType === 'cOwner' || roleType === 'dOwner')) {
          console.log('first================');
        } else {
          dispatch(
            updateUserData({
              name: data?.name,
              email: data?.email,
              id: loginUser?.id,
              logo: data?.logo,
            }),
          );
        }
      }
    }
  };
  const getCompanyProfile = async () => {
    const response = await get({
      endPoint: END_POINTS.GET_COMPANY_ID + '?id=' + userCompany?.company_id,
      params: {},
      isLoader: true,
    });
    if (response?.data) {
      let {data} = response;
      setProfileData({
        id: loginUser?.id,
        logo: data?.logo,
        // company: data?.company,
        name: data?.name,
        phone_number: data?.phone,
        address: data?.address,
        email: data?.email,
      });
      let companyData = {...userCompany};
      companyData.company = data;
      dispatch(updateCompany(companyData));
      // dispatch(updateUserCompany(companyData));
      console.log(userCompany, 'DATA======1111111', companyData);
      if (dealerCompany && (roleType === 'cOwner' || roleType === 'dOwner')) {
        dispatch(
          updateUserData({
            name: data?.name,
            email: data?.email,
            id: loginUser?.id,
            logo: data?.logo,
          }),
        );
      }
    }
  };
  const handleSelectImage = async () => {
    const selectedImage = await pickImage();
    console.log('Selected Image:', selectedImage);
    setImage(selectedImage);
  };
  return (
    <View style={{backgroundColor: Colors.white}}>
      <KeyboardAwareScroll onRefreshing={() => loadData()}>
        {profileData ? (
          <View style={CommonStyles.mainContainer}>
            <View style={styles.proPicContainer}>
              <View
                style={{
                  height: getHeight(7),
                  width: getHeight(7),
                  backgroundColor: Colors.menUGrayBg,
                  // padding: getWidth(45),
                  borderRadius: getWidth(1),
                }}>
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.proPic}
                  source={
                    profileData.logo || image
                      ? {uri: image ? image.uri : profileData.logo}
                      : images.placeholder_image
                  }
                />
                {isEdit ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleSelectImage();
                    }}
                    style={styles.imgIconContainer}>
                    <Icon
                      color={Colors.black}
                      size={getHeight(45)}
                      iconName="camera"
                      family="Feather"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              {isEdit ? (
                <Text
                  style={{
                    marginTop: getHeight(120),
                    marginLeft: getHeight(60),
                    fontSize: getHeight(65),
                    color: Colors.appYellow,
                  }}>
                  Supported formats: JPG, JPEG, or PNG. File size should be less
                  than 2 MB.
                </Text>
              ) : null}
              <Text style={styles.companyName}>{profileData?.name}</Text>
              {!isEdit ? (
                <>
                  <TouchableOpacity
                    onPress={() => setIsEdit(true)}
                    style={styles.editBtn}>
                    <Text style={styles.editBtnTxt}>Edit</Text>
                  </TouchableOpacity>

                  {/* <FieldView value={profileData?.company} label="Company" /> */}
                  <FieldView label="Name" value={profileData?.name} />
                  <FieldView
                    label="Phone Number"
                    value={profileData?.phone_number}
                  />
                  <FieldView label="Address" value={profileData?.address} />
                  <FieldView label="Email address" value={profileData?.email} />
                </>
              ) : (
                <EditProfile
                  localImage={image}
                  isCompany={
                    route?.params?.isCompany ||
                    (dealerCompany &&
                      (roleType === 'cOwner' || roleType === 'dOwner'))
                  }
                  cancelPress={() => {
                    setImage(null);
                    // getProfile();
                    setIsEdit(false);
                  }}
                  profileData={profileData}
                />
              )}
            </View>
          </View>
        ) : null}
      </KeyboardAwareScroll>
    </View>
  );
};

export default ViewProfile;
