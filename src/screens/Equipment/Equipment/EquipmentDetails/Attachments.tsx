/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CommonStyles from '../../../../theme/CommonStyles';
import {getHeight, getWidth} from '../../../../theme/Constants';
import Colors from '../../../../theme/Colors';
import SvgIcon from '../../../../assets/Icons/SvgIcon';
import {useAlert} from '../../../../utils/hooks';
import {useUpdateEquipmentAttachment} from '../../../../Api/hooks';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';
import {EmptyRecord, FormButton, SearchBox} from '../../../../components';
import {useToast} from 'react-native-toast-notifications';
interface AttachmentsInterface {
  attachmentList: any[];
  equipment: any;
  editable?: boolean;
}
const Attachments: FC<AttachmentsInterface> = ({
  attachmentList = [],
  equipment = null,
  editable = false,
}) => {
  const attachmentsData = useSelector(
    (state: RootState) => state.AttachmentReducer.attachmentList,
  );
  const toast = useToast();
  const {Alert, showAlert} = useAlert();
  const [attachList, setAttachList] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearch] = useState('');
  const [newAttachedArray, setAttachedArray] = useState<any>([]);
  const [updateAttachment] = useUpdateEquipmentAttachment();

  useEffect(() => {
    const filteredAttachmentsData = attachmentsData.reduce((acc, item) => {
      if (!attachmentList.some(attachment => attachment.id === item.id)) {
        acc.push(item);
      }
      return acc;
    }, []);
    setAttachList(filteredAttachmentsData);
  }, [attachmentsData, attachmentList]);
  const searchByUnitNo = () => {
    const searchTerm = searchText.toLowerCase();
    let list = attachList.filter((item: any) => {
      return (
        item.unit_no.toLowerCase().includes(searchTerm) &&
        item.is_archived !== 1
      );
    });
    return list;
    // console.log(list);
  };
  const detachAttachment = async (attachment: any) => {
    showAlert('Warning', 'Are you want to disconnect the attachment?', [
      {text: 'Cancel', onPress: () => null},
      {
        text: 'Confirm',
        onPress: async () => {
          const params = {
            equipment_id: equipment?.id,
            type: 0,
            'attachment_id[0]': [attachment?.id],
            isForm: true,
          };
          const response = await updateAttachment(params);
          console.log(response);
        },
      },
    ]);
  };
  const attachEquipments = async () => {
    toast.hideAll();
    if (newAttachedArray.length < 1) {
      toast.show('Select attachments to connect');
      return true;
    }
    setIsOpen(false);
    const attachmentIds = newAttachedArray.reduce(
      (obj: any, element: any, index: any) => {
        obj[`attachment_id[${index}]`] = element;
        return obj;
      },
      {},
    );
    const params = {
      ...attachmentIds,
      equipment_id: equipment?.id,
      type: 1,
      isForm: true,
    };
    const response = await updateAttachment(params);
    if (response) {
      setAttachedArray([]);
    } else {
      setIsOpen(true);
    }
  };
  return (
    <>
      {editable || attachmentList.length > 0 ? (
        <View style={{marginBottom: getHeight(45)}}>
          <Text style={[CommonStyles.font45bold, {fontSize: getHeight(55)}]}>
            Connected Attachments
          </Text>
          <View
            style={{
              borderWidth: 0.8,
              borderColor: Colors.borderGray,
              padding: 15,
              marginTop: getHeight(75),
              borderRadius: 8,
            }}>
            {attachmentList?.map((item: any) => {
              return (
                <View key={item?.id.toString()} style={styles.container}>
                  <Text style={[styles.valueText, {width: '90%'}]}>
                    {item?.unit_no}
                  </Text>
                  {editable ? (
                    <TouchableOpacity
                      onPress={() => {
                        detachAttachment(item);
                      }}
                      style={[
                        {
                          width: getHeight(22),
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      <SvgIcon.Settings
                        height={getHeight(32)}
                        width={getHeight(32)}
                        fill={Colors.appYellow}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
            {editable ? (
              <TouchableOpacity onPress={() => setIsOpen(true)}>
                <Text style={[styles.valueText]}>+ Connect new</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Alert />
          <Modal visible={isOpen} transparent>
            <View
              style={[
                CommonStyles.containerFlex1,
                {
                  backgroundColor: Colors.transparentBlack,
                  justifyContent: 'center',
                },
              ]}>
              <View
                style={{
                  height: '80%',
                  width: '90%',
                  backgroundColor: Colors.white,
                  alignSelf: 'center',
                  paddingBottom: getHeight(45),
                  padding: getWidth(18),
                  borderRadius: 8,
                }}>
                <SearchBox
                  // onEndEditing={() => null}
                  onChange={(text: string) => setSearch(text)}
                />
                {searchByUnitNo().length > 0 ? (
                  <FlatList
                    keyExtractor={({item}) => item?.id.tostring()}
                    data={searchByUnitNo()}
                    renderItem={({item}) => {
                      let isAdded = newAttachedArray.find(
                        (id: any) => id.toString() === item?.id.toString(),
                      );

                      return (
                        <View style={styles.itemView}>
                          <Text
                            style={{
                              fontSize: getHeight(55),
                              color: Colors.black,
                            }}>
                            {item?.unit_no}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              let finalArray = isAdded
                                ? newAttachedArray.filter(
                                    (id: any) =>
                                      id.toString() !== item?.id.toString(),
                                  )
                                : [item.id.toString(), ...newAttachedArray];
                              setAttachedArray(finalArray);
                            }}
                            style={{
                              backgroundColor: isAdded
                                ? Colors.errorColor
                                : Colors.appYellow,
                              padding: getHeight(75),
                              width: getWidth(4),
                              alignItems: 'center',
                              borderRadius: 10,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: isAdded ? Colors.white : Colors.black,
                                fontWeight: '500',
                              }}>
                              {isAdded ? 'Detach' : 'Attach'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <EmptyRecord />
                )}
                <View style={CommonStyles.flexRowContainer}>
                  <View style={CommonStyles.containerFlex1}>
                    <FormButton
                      onPress={() => setIsOpen(false)}
                      label="Cancel"
                    />
                  </View>
                  <View
                    style={[
                      CommonStyles.containerFlex1,
                      {paddingLeft: getWidth(40)},
                    ]}>
                    <FormButton
                      isYellow={true}
                      onPress={() => attachEquipments()}
                      label="Confirm"
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </>
  );
};

export default Attachments;

const styles = StyleSheet.create({
  container: {
    paddingBottom: getHeight(85),
    borderBottomWidth: 0.6,
    borderColor: '#C6C6C8',
    marginBottom: getHeight(55),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: getHeight(55),
    flex: 1,
  },
  itemView: {
    marginBottom: getHeight(85),
    backgroundColor: '#F8F8FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: getHeight(18),
    padding: getHeight(55),
    borderRadius: 8,
  },
});
