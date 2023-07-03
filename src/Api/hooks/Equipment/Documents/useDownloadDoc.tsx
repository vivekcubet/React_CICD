import downloadFile from '../../../../utils/helpers/downLoadFile';
import fs from 'react-native-fs';
import getFilenameFromUrl from '../../../../utils/helpers/getFileNameFromUrl';
import {useDispatch, useSelector} from 'react-redux';
import {updateDocumentsList} from '../../../../redux/reducers/Equipment/EquipmentReducer';
import {RootState} from '../../../../redux/store';

export interface Equipment {
  parts: any[];
}

interface GetData {
  equipments: any[];
}

interface GetResponse {
  result?: any;
  data?: any[];
}

const useDownloadDoc = (): [(options: GetData) => Promise<GetResponse[]>] => {
  const dispatch = useDispatch();
  const {documentsList} = useSelector(
    (state: RootState) => state.EquipmentReducer,
  );
  const downloadEquipmentDocs = async (
    options: GetData,
  ): Promise<GetResponse[]> => {
    const {equipments = []} = options;
    let docList: any[] = [...documentsList];
    console.log(documentsList, 'TEST==========');
    await Promise.all(
      equipments.flatMap((item: Equipment) =>
        item.parts.flatMap((part: any) =>
          part.documents.map(async (docItem: any) => {
            if (docItem?.is_archived !== 1) {
              const docFile = {...docItem};
              const fileUrl = docItem.path;
              const customFolder = 'EquipmentDocuments'; // Specify your custom folder name here
              const parentFolder = `${fs.DocumentDirectoryPath}/serviceConnection`;
              const destinationPath = `${parentFolder}/${customFolder}/${getFilenameFromUrl(
                docItem.path,
              )}`;

              try {
                const isDownloadComplete = await downloadFile(
                  fileUrl,
                  destinationPath,
                  getFilenameFromUrl(docItem.path),
                );

                if (isDownloadComplete) {
                  console.log(
                    'File download completed successfully.',
                    destinationPath,
                  );
                  docFile.localPath = 'file:///' + destinationPath;
                  docList = [docFile, ...docList];
                  dispatch(updateDocumentsList(docList));
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
          }),
        ),
      ),
    ).then(downloadedDocs => {
      docList = [...downloadedDocs];
      console.log(docList, 'EQUIPMENT_DOCS_ITEM========');
      dispatch(updateDocumentsList(docList));
    });

    return []; // Placeholder return value
  };

  return [downloadEquipmentDocs];
};

export default useDownloadDoc;
