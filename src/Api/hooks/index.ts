export {default as useEquipmentCategories} from './EquipmentModal/useEquipmentCategories';
export {default as usePostEquipmentModel} from './EquipmentModal/usePostEquipmentModel';
export {default as useGetEquipmentModels} from './EquipmentModal/useGetEquipmentModels';
export {default as useArchiveEquipmentModel} from './EquipmentModal/useArchiveEquipmentModel';
export {default as useUnArchiveEquipmentModel} from './EquipmentModal/useUnArchiveEquipmentModel';

// PARTS AND MATERIALS
export {default as useGetMeasurementTypes} from './PartsAndMaterials/useGetMeasurementTypes';
export {default as useGetPartsCategories} from './PartsAndMaterials/useGetPartsCategories';
export {default as usePostPartsAndMaterials} from './PartsAndMaterials/usePostPartsAndMaterials';
export {default as useGetPartsAndMaterials} from './PartsAndMaterials/useGetPartsAndMaterials';
export {default as useUnArchiveParts} from './PartsAndMaterials/useUnArchiveParts';

// SERVICE INTERVALS
export {default as useGetServiceIntervals} from './ServiceIntervals/useGetServiceIntervals';
export {default as usePostServiceInterval} from './ServiceIntervals/usePostServiceInterval';
export {default as useArchiveServiceInterval} from './ServiceIntervals/useArchiveServiceInterval';
export {default as useUnArchiveServiceInterval} from './ServiceIntervals/useUnArchiveServiceInterval';

// SERVICE TASKS
export {default as useGetServiceTasks} from './ServiceTasks/useGetServiceTasks';
export {default as usePostServiceTask} from './ServiceTasks/usePostServiceTask';

// SERVICE TEMPLATES
export {default as useGetServiceTemplates} from './ServiceTemplates/useGetServiceTemplates';
export {default as usePostServiceTemplate} from './ServiceTemplates/usePostServiceTemplate';

// COMPANY

export {default as useGetCompanyList} from './Company/useGetCompanyList';
export {default as useCreateCompany} from './Company/useCreateCompany';
export {default as useDeleteCompany} from './Company/useDeleteCompany';

// DEALER
export {default as useGetDealerList} from './Dealer/useGetDealerList';
export {default as useCreateDealer} from './Dealer/useCreateDealer';
export {default as useDeleteDealer} from './Dealer/useDeleteDealer';
export {default as useUpdateDealerClients} from './Dealer/useUpdateDealerClients';

// USER
export {default as useGetUserList} from './User/useGetUserList';
export {default as useCreateUser} from './User/useCreateUser';
export {default as useArchiveUser} from './User/useArchiveUser';
export {default as useGetAllTechnicians} from './User/useGetAllTechnicians';

// FORGOT PASSWORD
export {default as useSendOtp} from './ForgotPassword/useSendOtp';
export {default as useVerifyOtp} from './ForgotPassword/useVerifyOtp';

// EQUIPMENTS
export {default as useGetEquipments} from './Equipment/Equipments/useGetEquipments';
export {default as useArchiveEquipment} from './Equipment/Equipments/useArchiveEquipment';
export {default as useArchiveAttachment} from './Equipment/Attachments/useArchiveAttachment';
export {default as useGetAttachments} from './Equipment/Attachments/useGetAttachments';
export {default as useAddAttachment} from './Equipment/Attachments/useAddAttachment';
export {default as usePostEquipment} from './Equipment/Equipments/usePostEquipment';
export {default as useLoadInitialData} from './useLoadInitialData';
export {default as useUpdateEquipmentAttachment} from './Equipment/Attachments/useUpdateEquipmentAttachment';

//
export {default as useUploadDocuments} from './Equipment/Documents/useUploadDocuments';
export {default as useGetEquipmentDoc} from './Equipment/Documents/useGetEquipmentDoc';
export {default as useDownloadDoc} from './Equipment/Documents/useDownloadDoc';

// FLUID STICKER
export {default as useGetFluidStickers} from './Equipment/FluidSticker/useGetFluidStickers';
export {default as usePostFluidSticker} from './Equipment/FluidSticker/usePostFluidSticker';
export {default as useArchiveFluidSticker} from './Equipment/FluidSticker/useArchiveFluidSticker';
export {default as useResetFluidSticker} from './Equipment/FluidSticker/useResetFluidSticker';

// CHECK LIST
export {default as useGetDailyChecklists} from './Equipment/DailyCheckList/useGetDailyChecklists';
export {default as useArchiveDailyChecklist} from './Equipment/DailyCheckList/useArchiveDailyChecklist';
export {default as usePostDailyChecklist} from './Equipment/DailyCheckList/usePostDailyChecklist';
export {default as useAddDailyChecklist} from './Equipment/DailyCheckList/useAddDailyChecklist';
export {default as useGetChecklistLog} from './Equipment/DailyCheckList/useGetChecklistLog';
export {default as usePostSyncDailyChecklist} from './OfflineSync/useSyncDailyChecklist';

export {default as usePostService} from './PreventiveMaintenance/Service/usePostService';
export {default as useArchiveService} from './PreventiveMaintenance/Service/useArchiveService';
export {default as useUnArchiveService} from './PreventiveMaintenance/Service/useUnArchiveService';
export {default as useGetServiceList} from './PreventiveMaintenance/Service/useGetServiceList';
export {default as useSyncServiceList} from './OfflineSync/useSyncServiceList';
export {default as useDownloadServiceDocs} from './PreventiveMaintenance/Service/useDownloadServiceDocs';
export {default as useDownloadServiceDoc} from './PreventiveMaintenance/Service/useDownloadServiceDoc';

export {default as usePostRepair} from './PreventiveMaintenance/Repair/usePostRepair';
export {default as useGetRepairList} from './PreventiveMaintenance/Repair/useGetRepairList';
export {default as useUnArchiveRepair} from './PreventiveMaintenance/Repair/useUnarchiveRepair';
export {default as useArchiveRepair} from './PreventiveMaintenance/Repair/useArchiveRepair';
export {default as useSyncRepairList} from './OfflineSync/useSyncRepairList';
export {default as useDownloadRepairDoc} from './PreventiveMaintenance/Repair/useDownloadRepairDoc';

export {default as useGetCompanyTechnicians} from './User/useGetCompanyTechnicians';
