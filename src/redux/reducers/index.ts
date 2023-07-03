import {combineReducers} from 'redux';
import globalReducer from './GlobalReducer';
import AuthReducer from './AuthReducer';
import EquipmentModelReducer from './EquipmentModelReducer';
import PartsAndMaterialReducer from './PartsAndMaterialReducer';
import ServiceIntervalReducer from './ServiceIntervalReducer';
import ServiceTaskReducer from './ServiceTaskReducer';
import ServiceTemplateReducer from './ServiceTemplateReducer';
import EquipmentReducer from './Equipment/EquipmentReducer';
import AttachmentReducer from './Equipment/AttachmentReducer';
import TechnicianReducer from './Users/TechnicianReducer';
import ServiceReducer from './PreventiveMaintenance/ServiceReducer';
import RepairReducer from './PreventiveMaintenance/RepairReducer';
import OfflineReducer from './OfflineReducer';
const rootReducer = combineReducers({
  globalReducer: globalReducer,
  AuthReducer: AuthReducer,
  EquipmentModelReducer: EquipmentModelReducer,
  PartsAndMaterialReducer,
  ServiceIntervalReducer,
  ServiceTaskReducer,
  ServiceTemplateReducer,
  EquipmentReducer,
  AttachmentReducer,
  TechnicianReducer,
  ServiceReducer,
  RepairReducer,
  OfflineReducer: OfflineReducer,
});

export default rootReducer;
