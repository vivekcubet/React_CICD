/* eslint-disable dot-notation */
import {View} from 'react-native';
import React, {FC} from 'react';
import {InputTextLogin, SubmitButton} from '../../../components';
import styles from './styles';
import ProfileInterface from '../ProfileInterface';
import {Formik} from 'formik';
import {profileValidation} from '../../../utils/validations';
import usePostApi from '../../../Api/hooks/usePostApi';
import {END_POINTS} from '../../../Api/constants';
import {useCreateCompany} from '../../../Api/hooks';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserCompany} from '../../../redux/reducers/AuthReducer';
import useGetApi from '../../../Api/hooks/useGetApi';
import {RootState} from '../../../redux/store';
interface EditProfile {
  profileData: ProfileInterface;
  cancelPress(): any;
  isCompany?: any;
  localImage?: any;
}
const EditProfile: FC<EditProfile> = ({
  profileData,
  cancelPress,
  isCompany = false,
  localImage,
}) => {
  console.log(profileData, 'DATA===');
  const [createCompany, {errors: postErrors}] = useCreateCompany();
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [postApi] = usePostApi();
  const [get] = useGetApi();
  const dispatch = useDispatch();
  console.log(postErrors);
  const handleEditProfile = async (values: ProfileInterface) => {
    if (isCompany) {
      let params: any = {
        ...values,
        isEdit: true,
        id: userCompany?.company_id,
        isForm: localImage ? true : false,
      };
      params['phone'] = params['phone_number'];
      delete params['phone_number'];
      if (localImage) {
        params['logo'] = localImage;
      }
      let companyResponse = await createCompany(params);
      if (companyResponse) {
        const response = await get({
          endPoint:
            END_POINTS.GET_COMPANY_ID + '?id=' + userCompany?.company_id,
          params: {},
          isLoader: true,
        });
        if (response.data) {
          let tempCompany = {...userCompany};
          tempCompany.company = response?.data;
          dispatch(updateUserCompany(tempCompany));
        }
        cancelPress();
      }
    } else {
      let params: any = {...values};
      if (localImage) {
        params['logo'] = localImage;
      }
      let profileResponce = await postApi({
        endPoint: END_POINTS.UPDATE_PROFILE,
        params: params,
        isForm: localImage ? true : false,
      });
      if (profileResponce) {
        console.log(values);
        cancelPress();
      }
    }
  };
  return (
    <Formik
      initialValues={{
        // company: profileData?.company,
        name: profileData?.name,
        address: profileData?.address,
        phone_number: profileData?.phone_number,
        email: profileData?.email,
        id: profileData.id,
      }}
      validationSchema={profileValidation}
      onSubmit={handleEditProfile}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.container}>
          {/* <InputTextLogin
            PlaceHolder="Company"
            value={values.company}
            onBlur={handleBlur('company')}
            onChange={handleChange('company')}
            error={touched.company && errors.company ? errors.company : ''}
          /> */}
          <InputTextLogin
            maxLength={isCompany ? 30 : 25}
            PlaceHolder="Name"
            value={values.name}
            onBlur={handleBlur('name')}
            onChange={handleChange('name')}
            error={touched.name && errors.name ? errors.name : ''}
          />
          <InputTextLogin
            isPhone={true}
            maxLength={21}
            PlaceHolder="Phone Number"
            value={values.phone_number}
            onBlur={handleBlur('phone_number')}
            onChange={handleChange('phone_number')}
            keyboardType="number-pad"
            error={
              touched.phone_number && errors.phone_number
                ? errors.phone_number
                : ''
            }
          />
          <InputTextLogin
            isTextArea={true}
            maxLength={250}
            PlaceHolder="Address"
            value={values.address}
            onBlur={handleBlur('address')}
            onChange={handleChange('address')}
            error={touched.address && errors.address ? errors.address : ''}
          />
          <InputTextLogin
            maxLength={100}
            isDisabled={true}
            PlaceHolder="Email"
            value={values.email}
            onBlur={handleBlur('email')}
            onChange={handleChange('email')}
            keyboardType={'email-address'}
            editable={false}
            error={touched.email && errors.email ? errors.email : ''}
          />
          <View style={styles.bottomBtnContainer}>
            <View style={styles.submitBtnContainer}>
              <SubmitButton onPress={handleSubmit} label="Save" />
            </View>
            <View style={styles.submitBtnContainer}>
              <SubmitButton
                onPress={() => cancelPress()}
                isWhite={true}
                label="Cancel"
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default EditProfile;
