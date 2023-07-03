/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, FlatList, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import Colors from '../../../../theme/Colors';
import {
  ArchiveLabelItem,
  BackButton,
  EmptyRecord,
  FormButton,
  KeyboardAwareScroll,
  LabelValue,
  SearchBox,
} from '../../../../components';
import {pickDocument} from '../../../../utils/helpers/filePicker';
import {getHeight, getWidth} from '../../../../theme/Constants';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetEquipments, useUploadDocuments} from '../../../../Api/hooks';
import useArchiveApi from '../../../../Api/hooks/useArchiveApi';
import {END_POINTS} from '../../../../Api/constants';
import {useAlert} from '../../../../utils/hooks';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {
  useDeleteEquipmentDoc,
  useGetEquipmentDocuments,
} from '../../../../utils/LocalDBHooks';
import FileViewer from 'react-native-file-viewer';
import deleteFile from '../../../../utils/helpers/deleteLocalFile';
const EquipmentDocument = ({route}: any) => {
  const {equipment} = route?.params;
  const [getEquipmentDocs] = useGetEquipmentDocuments();
  const [getEquipments] = useGetEquipments();
  const [deleteEquipmentDoc] = useDeleteEquipmentDoc();
  const {roleType} = useSelector((state: RootState) => state.AuthReducer);
  const {documentsList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const toast = useToast();
  const {Alert, showAlert} = useAlert();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [uploadDocument] = useUploadDocuments();
  const [archiveData] = useArchiveApi();
  const [equipmentDocs, setEquipmentDocs] = useState<any>([]);
  const [searchText, setSearch] = useState('');
  const [finalSearchText, setFinalSearch] = useState('');
  useEffect(() => {
    getDocList();
  }, [equipment, finalSearchText, documentsList]);
  const getDocList = async (): Promise<void> => {
    let documents = await getEquipmentDocs({
      equipmentId: equipment?.id,
      searchText: finalSearchText,
    });
    console.log(documents, 'DOC LIST');
    setEquipmentDocs(documents);
  };
  const uploadFile = async () => {
    let file = await pickDocument();
    if (file) {
      let response = await uploadDocument({
        path: file,
        description: equipment?.unit_no,
        name: file?.name
          ? file?.name.toString()
          : equipment?.unit_no.toString(),
        equipment_id: equipment.id,
      });
      if (response) {
        await getEquipments({isLoader: true});
      }
    }
  };
  const openFile = async (doc: any): Promise<void> => {
    if (doc?.localPath) {
      FileViewer.open(doc?.localPath);
    } else if (doc?.path) {
      await Linking.openURL(doc?.path);
    }
  };
  const deleteAttachment = async (item: any) => {
    toast.hideAll();
    showAlert('Warning', 'Are you want to remove the document?', [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {
        text: 'Confirm',
        onPress: async () => {
          let archiveResponse = await archiveData({
            endPoint:
              END_POINTS.ARCHIVE_EQUIPMENT_DOCUMENTS +
              '?id=' +
              item?.id?.toString(),
            params: {},
          });
          if (archiveResponse) {
            if (item?.localPath) {
              deleteFile(item?.localPath);
              deleteEquipmentDoc({docId: item?.id});
            }
            toast.show(archiveResponse.message);
            getDocList();
          }
        },
      },
    ]);
  };
  return (
    <View
      style={[{backgroundColor: Colors.white}, CommonStyles.containerFlex1]}>
      <KeyboardAwareScroll
        onRefreshing={() => {
          getDocList();
        }}>
        <View
          style={[
            CommonStyles.mainContainer,
            {
              paddingBottom:
                roleType === 'cOwner' ? getHeight(6) : getHeight(16),
            },
          ]}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text
            style={[
              CommonStyles.font45bold,
              {marginTop: getHeight(45), color: Colors.black},
            ]}>
            Equipment Documents
          </Text>
          <View style={{marginTop: getHeight(35), padding: getWidth(35)}}>
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
            <LabelValue label="Unit #" value={equipment?.unit_no} />
            <Text
              style={[
                {
                  fontSize: getHeight(55),
                  marginTop: getHeight(45),
                  fontWeight: '500',
                  marginBottom: getHeight(55),
                },
              ]}>
              Uploaded Documents
            </Text>
            <FlatList
              nestedScrollEnabled={true}
              contentContainerStyle={
                {
                  // height: getHeight(3.2),
                  // backgroundColor: 'yellow',
                }
              }
              renderItem={({item}) => {
                return (
                  <ArchiveLabelItem
                    isView={true}
                    onPressItem={() => (item?.path ? openFile(item) : null)}
                    onPressView={() => (item?.path ? openFile(item) : null)}
                    onPress={() => deleteAttachment(item)}
                    isDelete={true}
                    disabled={roleType === 'cOwner' ? false : true}
                    btnName="Remove"
                    label={item.name}
                  />
                );
              }}
              data={equipmentDocs}
              ListEmptyComponent={EmptyRecord}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </KeyboardAwareScroll>
      {roleType === 'cOwner' ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            width: '100%',
            padding: getHeight(45),
            backgroundColor: Colors.white,
          }}>
          <Text
            style={{
              marginLeft: getHeight(60),
              fontSize: getHeight(65),
              color: Colors.appYellow,
              marginBottom: getHeight(60),
            }}>
            Supported formats: JPEG, JPG, PNG, PDF, DOC, DOCX, XLS, XLSX. File
            size should be less than 2 MB.
          </Text>
          <FormButton
            isYellow={true}
            onPress={() => uploadFile()}
            label="Upload a file"
          />
        </View>
      ) : null}

      <Alert />
    </View>
  );
};

export default EquipmentDocument;
