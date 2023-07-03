import {useDispatch, useSelector} from 'react-redux';
import getFilenameFromUrl from '../../../../utils/helpers/getFileNameFromUrl';
import {END_POINTS} from '../../../constants';
import useGetApi from '../../useGetApi';
import NetInfo from '@react-native-community/netinfo';
import {RootState} from '../../../../redux/store';
import fs from 'react-native-fs';
import downloadFile from '../../../../utils/helpers/downLoadFile';
import {updateServiceDocList} from '../../../../redux/reducers/PreventiveMaintenance/ServiceReducer';
import isUrlValid from '../../../../utils/helpers/checkIsValidUrl';

export interface GetData {
  isLoader?: boolean;
}
interface GetResponse {
  data?: any;
  results?: any;
  status?: any;
  message?: any;
}

const useDownloadServiceDocs = (): [
  (options: GetData) => Promise<GetResponse>,
] => {
  const {userCompany} = useSelector((state: RootState) => state.AuthReducer);
  const [get] = useGetApi();
  const dispatch = useDispatch();
  const downloadServiceDocuments = async (options: GetData) => {
    const {isLoader = true} = options;
    let docList: any[] = [];
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      const response = await get({
        endPoint:
          END_POINTS.GET_SERVICE_DOCS_LIST +
          '?company_id=' +
          userCompany?.company_id,
        params: {},
        isLoader: isLoader,
      });
      if (response.data) {
        const {data} = response;
        await Promise.all(
          data.map(async (checkListItem: any) => {
            const docFile = {...checkListItem};
            const fileUrl = checkListItem.path;
            const customFolder = 'ServiceDocuments'; // Specify your custom folder name here
            const parentFolder = `${fs.DocumentDirectoryPath}/serviceConnection`;
            const destinationPath = `${parentFolder}/${customFolder}/${getFilenameFromUrl(
              checkListItem.path,
            )}`;
            if (checkListItem.path && isUrlValid(checkListItem.path)) {
              try {
                const isDownloadComplete = await downloadFile(
                  fileUrl,
                  destinationPath,
                  getFilenameFromUrl(checkListItem.path),
                );

                if (isDownloadComplete) {
                  console.log(
                    'File download completed successfully.',
                    destinationPath,
                  );
                  docFile.localPath = 'file:///' + destinationPath;
                } else {
                  console.log('File download failed.');
                }
              } catch (error) {
                console.error(
                  'An error occurred while handling the download:',
                  error,
                );
              }
            }

            return docFile;
          }),
        ).then(downloadedDocs => {
          docList = [...downloadedDocs];
          console.log(docList, 'SERVICE_DOCS_ITEM====');
          dispatch(updateServiceDocList(docList));
        });
        console.log(docList, 'SERVICE_DOCS_ITEM====222');
        console.log(data, 'TEST======DOC');
        return data;
      }
    }
  };

  return [downloadServiceDocuments];
};

export default useDownloadServiceDocs;
