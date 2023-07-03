import {
  useGetAllTechnicians,
  useGetAttachments,
  useGetCompanyTechnicians,
  useGetDailyChecklists,
  useGetEquipmentModels,
  useGetEquipments,
  useGetFluidStickers,
  useGetMeasurementTypes,
  useGetPartsAndMaterials,
  useGetPartsCategories,
  useGetRepairList,
  useGetServiceIntervals,
  useGetServiceTasks,
  useGetServiceTemplates,
} from '../hooks';

const useLoadInitialData = () => {
  const [getPartsMeasurements] = useGetMeasurementTypes();
  const [getEquipmentModels] = useGetEquipmentModels();
  const [getPartsAndMaterials] = useGetPartsAndMaterials();
  const [getServiceIntervals] = useGetServiceIntervals();
  const [getTaskList] = useGetServiceTasks();
  const [getServicesTemplateList] = useGetServiceTemplates();
  const [getPartsCategories] = useGetPartsCategories();
  const [getEquipments] = useGetEquipments();
  const [getAttachments] = useGetAttachments();
  const [getCompanyTechnicians] = useGetCompanyTechnicians();
  const [getFluidStickers] = useGetFluidStickers();
  const [getTechnicianList] = useGetAllTechnicians();
  const [getDailyChecklists] = useGetDailyChecklists();
  const [getRepairList] = useGetRepairList();
  const loadInitialSetup = async () => {
    await getEquipmentModels({isLoader: false});
    await getPartsAndMaterials({isLoader: false});
    await getServiceIntervals({isLoader: false});
    await getTaskList({isLoader: false});
    await getEquipments({isLoader: false});
    await getAttachments({isLoader: false});
    await getPartsMeasurements({isLoader: false});
    await getServicesTemplateList({isLoader: false});
    await getCompanyTechnicians({isLoader: false});
    await getFluidStickers({isLoader: false});
    await getTechnicianList({isLoader: false});
    await getDailyChecklists({isLoader: false});
    await getRepairList({isLoader: false});
    getPartsCategories();
  };

  return loadInitialSetup;
};

export default useLoadInitialData;
