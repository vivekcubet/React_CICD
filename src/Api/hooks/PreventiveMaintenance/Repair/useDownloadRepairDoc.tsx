import downloadFile from '../../../../utils/helpers/downLoadFile';
import fs from 'react-native-fs';
import getFilenameFromUrl from '../../../../utils/helpers/getFileNameFromUrl';
import {useDispatch} from 'react-redux';
import isUrlValid from '../../../../utils/helpers/checkIsValidUrl';
import {updateRepairDocs} from '../../../../redux/reducers/PreventiveMaintenance/RepairReducer';

export interface Repair {
  work_attachments: any[];
}

interface GetData {
  repairList: Repair[];
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useDownloadRepairDoc = (): [
  (options: GetData) => Promise<GetResponse[]>,
] => {
  const dispatch = useDispatch();

  const downloadRepairDocs = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    const {repairList = []} = options;
    let docList: any[] = [];
    console.log(repairList, 'REPAIR_DOCS_LIST_ON========00');
    try {
      await Promise.all(
        repairList.flatMap((item: Repair) => {
          if (item.work_attachments.length > 0) {
            return item.work_attachments.map(async (workFileItem: any) => {
              console.log(workFileItem, 'REPAIR_DOCS_LIST_ON========11');
              if (
                workFileItem.work_file &&
                isUrlValid(workFileItem.work_file)
              ) {
                console.log(workFileItem, 'REPAIR_DOCS_LIST_ON========');
                const docFile = {...workFileItem};
                const fileUrl = workFileItem.work_file;
                const customFolder = 'repairDocuments'; // Specify your custom folder name here
                const parentFolder = `${fs.DocumentDirectoryPath}/serviceConnection`;
                const destinationPath = `${parentFolder}/${customFolder}/${getFilenameFromUrl(
                  workFileItem.work_file,
                )}`;
                try {
                  const isDownloadComplete = await downloadFile(
                    fileUrl,
                    destinationPath,
                    workFileItem.id.toString(),
                  );

                  if (isDownloadComplete) {
                    console.log(
                      workFileItem.id,
                      'SERVICE_DOCS_LIST_File download completed successfully.',
                      destinationPath,
                    );
                    docFile.localPath = 'file:///' + destinationPath;
                    docList = [docFile, ...docList];
                    dispatch(updateRepairDocs(docList));
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
        console.log(docList, 'REPAIR_DOCS_LIST====');
        dispatch(updateRepairDocs(docList));
      });
      console.log(docList, 'REPAIR_DOCS_LIST====222');
      return Promise.resolve([]); // Placeholder return value
    } catch (error: any) {
      console.log(error, 'DOC ERROR');
      return [];
    }
  };

  return [downloadRepairDocs];
};

export default useDownloadRepairDoc;
