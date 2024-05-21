import { RoleType } from '@libs/constants';

// All properties that a User has
export interface UserProps {
  role: RoleType;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Properties that are needed for a user creation
export interface CreateUserProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}
