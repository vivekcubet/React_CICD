import {createSlice} from '@reduxjs/toolkit';
import {RoleInterface, UserInterface} from '../../../types/userTypes';
export interface GlobalSliceInterface {
  user: UserInterface;
  dealerUser: UserInterface;
  loginUser: any;
  role: RoleInterface;
  isLogged: boolean;
  roleType: string;
  userCompany: any;
  dealerCompany: any;
  dealerCompanies: any;
  prevCompanyId: any;
  lastRefreshed: any;
}
const initialState: GlobalSliceInterface = {
  user: {
    name: '',
    email: '',
    id: '',
    logo: '',
  },
  dealerUser: {
    name: '',
    email: '',
    id: '',
  },
  loginUser: null,
  role: {
    id: 0,
    is_active: false,
    name: '',
    type: '',
  },
  userCompany: null,
  isLogged: false,
  roleType: '',
  dealerCompany: null,
  dealerCompanies: [],
  prevCompanyId: null,
  lastRefreshed: null,
};
export const authSlice = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {userRole, userData, userCompany} = action.payload;
      state.loginUser = {
        roleType: userRole.type,
        userCompany: userCompany,
        id: userData.id,
      };
      state.roleType = userRole?.type;
      state.user = userData;
      state.role = userRole;
      state.userCompany = userCompany;
      if (userRole.type === 'dOwner' || userRole.type === 'dTecnician') {
        console.log(action.payload?.userCompany, 'Dealer Companies');
        state.dealerCompany = userCompany;
        state.dealerUser = userData;
      }
    },
    updateDealerCompanies: (state, action) => {
      state.dealerCompanies = action.payload?.companies;
    },
    updateUserCompany: (state, action) => {
      state.userCompany = action.payload;
      if (state.dealerCompany) {
        state.user = {
          name: action.payload.company.name,
          email: action.payload.company.email,
          id: action.payload.company.id,
          logo: action.payload.company.logo,
        };
      }
    },
    updateCompany: (state, action) => {
      state.userCompany = action.payload;
    },
    updateUserData: (state, action) => {
      console.log(action.payload?.logo, 'LOGO===');
      state.user = {
        name: action.payload?.name,
        email: action.payload?.email,
        id: action.payload?.id,
        logo: action.payload?.logo,
      };
    },
    updateDealerCompany: (state, action) => {
      const {selectedCompany, role} = action.payload;
      console.log(
        state.loginUser.roleType,
        'LOGIN USER======',
        selectedCompany,
      );
      if (state.loginUser?.roleType !== 'dTecnician') {
        state.user =
          role?.type === 'dOwner' || role?.type === 'dTecnician'
            ? state.dealerUser
            : {
                name: selectedCompany?.company?.name,
                email: selectedCompany?.company?.email,
                id: selectedCompany?.company?.id,
                logo: selectedCompany?.company?.logo,
              };
      }
      state.userCompany =
        role?.type !== 'dOwner' && role?.type !== 'dTecnician'
          ? selectedCompany
          : state.dealerCompany;
      state.role = role;
      state.roleType = role?.type;
    },
    updatePrevCompany: (state, action) => {
       console.log(action.payload, 'LAST REFRESHED=======111');
      state.prevCompanyId = action.payload;
    },
    updateLastRefreshed: (state, action) => {
      console.log(action.payload, 'LAST REFRESHED=======');
      state.lastRefreshed = action.payload;
    },
    resetAuthData: state => {
      state.user = {
        name: '',
        email: '',
        id: '',
      };
      state.dealerUser = {
        name: '',
        email: '',
        id: '',
      };
      state.role = {
        id: 0,
        is_active: false,
        name: '',
        type: '',
      };
      state.userCompany = null;
      state.isLogged = false;
      state.roleType = '';
      state.dealerCompany = null;
      state.dealerCompanies = [];
      state.prevCompanyId = null;
      state.lastRefreshed = null;
    },
  },
});
export const {
  updateUser,
  updateDealerCompanies,
  updateDealerCompany,
  resetAuthData,
  updateUserCompany,
  updateCompany,
  updateUserData,
  updatePrevCompany,
  updateLastRefreshed,
} = authSlice.actions;
export default authSlice.reducer;
