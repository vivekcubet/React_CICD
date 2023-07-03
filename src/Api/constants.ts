export const END_POINTS = {
  LOGIN: '/user/login',
  REGISTER: '/company/register',
  SEND_OTP: '/user/send/otp',
  VERIFY_OTP: '/user/verify/otp',
  FORGOT_RESET_OTP: '/user/reset/password',
  INITIAL_RESET_PWD: '/user/password/reset',
  GET_PROFILE: '/user/profile',
  GET_PROFILE_ID: '/user/user-details',
  UPDATE_PROFILE: '/user/user-update',

  /// Equipment model API
  EQUIPMENT_CATEGORIES: '/model/category/list',
  CREATE_EQUIPMENT_MODAL: '/model/create',
  GET_EQUIPMENT_MODELS: '/model/index',
  UPDATE_EQUIPMENT_MODEL: '/model/update',
  ARCHIVE_EQUIPMENT_MODEL: '/model/destroy',
  UNARCHIVE_EQUIPMENT_MODEL: '/model/unarchive',

  // Parts and Materials
  GET_PARTS_CATEGORIES: '/parts-meterial/category/list',
  GET_PARTS_MEASUREMENTS: '/parts-meterial/measurement/list',
  CREATE_PARTS_METERIAL: '/parts-meterial/create',
  UPDATE_PARTS_METERIAL: '/parts-meterial/update',
  GET_PARTS_METERIAL: '/parts-meterial/index',
  ARCHIVE_PARTS_METERIAL: '/parts-meterial/destroy',
  UNARCHIVE_PARTS_METERIAL: '/parts-meterial/unarchive',

  // Service Interval
  CREATE_SERVICE_INTERVAL: '/service/interval/create',
  UPDATE_SERVICE_INTERVAL: '/service/interval/update',
  GET_SERVICE_INTERVALS: '/service/interval/index',
  ARCHIVE_SERVICE_INTERVAL: '/service/interval/destroy',
  UNARCHIVE_SERVICE_INTERVAL: '/service/interval/unarchive',
  DUPLICATE_SERVICE_INTERVAL: '/service/interval/duplicate',

  // Service Tasks
  CREATE_SERVICE_TASK: '/service/task/create',
  UPDATE_SERVICE_TASK: '/service/task/update',
  GET_SERVICE_TASK: '/service/task/index',
  ARCHIVE_SERVICE_TASK: '/service/task/destroy',
  UNARCHIVE_SERVICE_TASK: '/service/task/unarchive',
  DELETE_SERVICE_TASK_PART: '/service/task/part/destroy',
  DUPLICATE_SERVICE_TASK: '/service/task/duplicate',

  // Service Templates
  CREATE_SERVICE_TEMPLATE: '/service/template/create',
  UPDATE_SERVICE_TEMPLATE: '/service/template/update',
  GET_SERVICE_TEMPLATES: '/service/template/index',
  ARCHIVE_SERVICE_TEMPLATE: '/service/template/destroy',
  UNARCHIVE_SERVICE_TEMPLATE: '/service/template/unarchive',
  DUPLICATE_SERVICE_TEMPLATE: '/service/template/duplicate',

  // COMPANY
  GET_COMPANIES: '/company/index',
  CREATE_COMPANY: '/company/create',
  UPDATE_COMPANY: '/company/update',
  DELETE_COMPANY: '/company/destroy',
  UNARCHIVE_COMPANY: '/company/unarchive',
  GET_COMPANY_ID: '/company/show',
  COMPANY_LOGO_REMOVE: '/company/logo/delete',

  // DEALER
  GET_DEALER: '/dealer/list',
  CREATE_DEALER: '/dealer/register',
  UPDATE_DEALER: '/dealer/update',
  DELETE_DEALER: '/dealer/delete',
  UNARCHIVE_DEALER: '/dealer/unarchive',
  GET_DEALER_CLIENTS: '/dealer/clients/list',
  ADD_DEALER_CLIENTS: '/dealer/clients/add',
  ADD_DEALER_COMPANY_OWNER: 'dealer/client/create',
  DELETE_DEALER_CLIENTS: '/dealer/clients/delete',

  //USER
  GET_USERS: '/user/index',
  CREATE_USER: 'user/user-create',
  UPDATE_USER: '/user/user-update',
  DELETE_USER: '/user/delete',
  UNARCHIVE_USER: '/user/unarchive',
  GET_USER_LIST: '/user/list',

  // EQUIPMENT
  GET_EQUIPMENTS: '/equipment/index',
  ARCHIVE_EQUIPMENT: '/equipment/destroy',
  UNARCHIVE_EQUIPMENT: '/equipment/unarchive',

  GET_ATTACHMENTS: '/equipment/attachment/index',
  ADD_ATTACHMENTS: '/equipment/attachment/create',
  UPDATE_ATTACHMENTS: '/equipment/attachment/update',
  DELETE_ATTACHMENT_LOGO: '/equipment/attachment/logo/delete',
  DELETE_EQUIPMENT_LOGO: '/equipment/logo/delete',
  POST_EQUIPMENTS: '/equipment/create',
  UPDATE_EQUIPMENTS: '/equipment/update',
  UPDATE_EQUIPMENT_ATTACHMENTS: '/equipment/attachment/attach',

  //EQUIPMENT DOC
  UPLOAD_EQUIPMENT_DOCUMENTS: '/equipment/document/create',
  GET_EQUIPMENT_DOCUMENTS: '/equipment/document/index',
  ARCHIVE_EQUIPMENT_DOCUMENTS: '/equipment/document/destroy',

  ARCHIVE_ATTACHMENT: '/equipment/attachment/destroy',
  UNARCHIVE_ATTACHMENT: '/equipment/attachment/unarchive',

  GET_FLUID_STICKER: '/equipment/fluid-sticker/index',
  ADD_FLUID_STICKER: '/equipment/fluid-sticker/create',
  ARCHIVE_FLUID_STICKER: '/equipment/fluid-sticker/destroy',
  UNARCHIVE_FLUID_STICKER: '/equipment/fluid-sticker/unarchive',
  RESET_FLUID_STICKER: '/equipment/fluid-sticker/reset',

  GET_DAILY_CHECKLIST: '/equipment/checklist/index',
  ARCHIVE_DAILY_CHECKLIST: '/equipment/checklist/destroy',
  UNARCHIVE_DAILY_CHECKLIST: '/equipment/checklist/unarchive',
  CREATE_DAILY_CHECKLIST: '/equipment/checklist/create',
  ADD_DAILY_CHECKLIST: '/equipment/checklist/day-check',
  UPDATE_DAILY_CHECKLIST: '/equipment/checklist/update',
  GET_DAILY_CHECKLIST_BY_DATE: '/equipment/checklist/log',
  SYNC_DAILY_CHECKLIST: '/equipment/checklist/day-check/sync',

  ADD_NEW_SERVICE: '/preventative-maintenance/service/create',
  UPDATE_SERVICE: '/preventative-maintenance/service/update',
  GET_SERVICE_LIST: '/preventative-maintenance/service/index',
  ARCHIVE_SERVICE_LIST: '/preventative-maintenance/service/destroy',
  UNARCHIVE_SERVICE_LIST: '/preventative-maintenance/service/unarchive',
  SYNC_SERVICE_LIST: '/preventative-maintenance/service/sync',
  GET_SERVICE_DOCS_LIST: '/preventative-maintenance/service/doclist',

  ADD_NEW_REPAIR: '/preventative-maintenance/repair/create',
  UPDATE_REPAIR: '/preventative-maintenance/repair/update',
  GET_REPAIR_LIST: '/preventative-maintenance/repair/index',
  UNARCHIVE_REPAIR_LIST: '/preventative-maintenance/repair/unarchive',
  ARCHIVE_REPAIR_LIST: '/preventative-maintenance/repair/destroy',
  SYNC_REPAIR_LIST: '/preventative-maintenance/repair/sync',
};
