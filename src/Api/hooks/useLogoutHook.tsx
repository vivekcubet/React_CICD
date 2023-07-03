import {useDispatch} from 'react-redux';
import {resetEquipmentModelSlice} from '../../redux/reducers/EquipmentModelReducer';
import {resetPartsAndMaterialSlice} from '../../redux/reducers/PartsAndMaterialReducer';
import {resetAuthData} from '../../redux/reducers/AuthReducer';
import {resetServiceIntervals} from '../../redux/reducers/ServiceIntervalReducer';
import {resetServiceTemplates} from '../../redux/reducers/ServiceTemplateReducer';
import {resetAttachments} from '../../redux/reducers/Equipment/AttachmentReducer';
import {resetEquipments} from '../../redux/reducers/Equipment/EquipmentReducer';
import {resetTechnicians} from '../../redux/reducers/Users/TechnicianReducer';
import {resetServiceReducer} from '../../redux/reducers/PreventiveMaintenance/ServiceReducer';
import {resetOffline} from '../../redux/reducers/OfflineReducer';

const useLogoutHook = () => {
  const dispatch = useDispatch();

  const logout = () => {
    // Call the reset action of the first reducer
    dispatch(resetEquipmentModelSlice());

    // Call the reset action of the second reducer
    dispatch(resetPartsAndMaterialSlice());
    dispatch(resetAuthData());
    dispatch(resetServiceIntervals());
    dispatch(resetServiceTemplates());
    dispatch(resetAttachments());
    dispatch(resetEquipments());
    dispatch(resetTechnicians());
    dispatch(resetServiceReducer());
    dispatch(resetOffline());
  };

  return logout;
};

export default useLogoutHook;
