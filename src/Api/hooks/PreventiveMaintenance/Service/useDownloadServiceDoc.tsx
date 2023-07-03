import downloadFile from '../../../../utils/helpers/downLoadFile';
import fs from 'react-native-fs';
import getFilenameFromUrl from '../../../../utils/helpers/getFileNameFromUrl';
import {useDispatch} from 'react-redux';
import {updateServiceDocList} from '../../../../redux/reducers/PreventiveMaintenance/ServiceReducer';
import isUrlValid from '../../../../utils/helpers/checkIsValidUrl';

export interface Service {
  checklist_task: any[];
}

interface GetData {
  serviceList: Service[];
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useDownloadServiceDoc = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const dispatch = useDispatch();

  const downloadServiceDocs = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    const {serviceList = []} = options;
    let docList: any[] = [];
    try {
      await Promise.all(
        serviceList.flatMap((item: Service) => {
          if (item.checklist_task.length > 0) {
            return item.checklist_task.map(async (checkListItem: any) => {
              if (checkListItem.path && isUrlValid(checkListItem.path)) {
                console.log(checkListItem, 'SERVICE_DOCS_LIST_ON========');
                const docFile = {...checkListItem};
                const fileUrl = checkListItem.path;
                const customFolder = 'serviceDocuments'; // Specify your custom folder name here
                const parentFolder = `${fs.DocumentDirectoryPath}/serviceConnection`;
                const destinationPath = `${parentFolder}/${customFolder}/${getFilenameFromUrl(
                  checkListItem.path,
                )}`;

                try {
                  const isDownloadComplete = await downloadFile(
                    fileUrl,
                    destinationPath,
                    checkListItem.id.toString(),
                  );

                  if (isDownloadComplete) {
                    console.log(
                      checkListItem.id,
                      'SERVICE_DOCS_LIST_File download completed successfully.',
                      destinationPath,
                    );
                    docFile.localPath = 'file:///' + destinationPath;
                    docList = [docFile, ...docList];
                    dispatch(updateServiceDocList(docList));
                  } else {
                    console.log('File download failed.');
                  }
                } catch (error) {
                  console.error(
                    'An error occurred while handling the download:',
                    error,
                  );
                }

                return docFile;
              }
            });
          } else {
            return []; // Return an empty array if checklist_task is empty
          }
        }),
      ).then(downloadedDocs => {
        docList = [...downloadedDocs];
        docList = docList.filter((element: any) => element !== undefined);
        console.log(docList, 'SERVICE_DOCS_LIST====');
        dispatch(updateServiceDocList(docList));
      });
      console.log(docList, 'SERVICE_DOCS_LIST====222');
      return Promise.resolve([]); // Placeholder return value
    } catch (error: any) {
      console.log(error, 'DOC ERROR');
      return [];
    }
  };

  return [downloadServiceDocs];
};

export default useDownloadServiceDoc;
