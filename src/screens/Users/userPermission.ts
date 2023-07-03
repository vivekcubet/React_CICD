export const getUserPermission = (userRole: string) => {
  const users = [
    {
      label: 'Companies',
      value: 'cOwner',
      permittedUsers: ['sAdmin'],
    },
    {
      label: 'Dealers',
      value: 'dOwner',
      permittedUsers: ['sAdmin'],
    },
    {
      label: 'Dealer Client',
      value: 'dClient',
      permittedUsers: ['dOwner'],
    },
    {
      label: 'Dealer Technician',
      value: 'dTecnician',
      permittedUsers: ['dOwner'],
    },
    {
      label: 'Company Owner',
      value: 'cOwnerC',
      permittedUsers: ['cOwner'],
    },
    {
      label: 'Company Technician',
      value: 'cTecnician',
      permittedUsers: ['cOwner'],
    },
    {
      label: 'Company Operator',
      value: 'cOperator',
      permittedUsers: ['cOwner'],
    },
  ];
  return users.filter(user => user.permittedUsers.includes(userRole));
};
