import SvgIcon from '../../../../assets/Icons/SvgIcon';
import icons from '../../../../assets/Icons/png';
import screens from '../../../../navigation/screens';

export const getEquipmentMenuPermission = (userRole: string) => {
  const users = [
    {
      menu: 'Daily \nChecklist',
      Icon: SvgIcon.DailyCheckIcon,
      screen: screens.addDailyChecklist,
      permittedUsers: ['cOwner', 'dTecnician', 'cTecnician'],
    },
    {
      menu: 'Add \n service',
      Icon: SvgIcon.TasksIcon,
      screen: screens.addService,
      permittedUsers: ['cOwner'],
    },
    {
      isImage: true,
      menu: 'Add \n repair',
      Icon: icons.maintenance,
      screen: screens.addRepair,
      permittedUsers: ['cOwner'],
    },

    {
      menu: 'Equipment \n Documents',
      Icon: SvgIcon.DocumentsIcon,
      screen: screens.equipmentDocument,
      permittedUsers: ['cOwner', 'dTecnician', 'cTecnician'],
    },
    {
      menu: 'View Parts & Materials',
      screen: screens.equipmentParts,
      Icon: SvgIcon.PartsIcon,
      permittedUsers: ['cOwner', 'dTecnician', 'cTecnician'],
    },
  ];
  return users.filter(user => user.permittedUsers.includes(userRole));
};
