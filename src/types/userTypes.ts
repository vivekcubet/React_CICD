export interface UserInterface {
  name: string;
  email: string;
  id?: any;
  logo?: any;
}
export interface RoleInterface {
  id: number;
  name: string;
  type: string;
  is_active: boolean;
}
