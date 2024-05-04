export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  name: string;
  password: string;
};

export type PasswordResetType = {
  email: string;
};

export type StoreNewPasswordType = {
  password: string;
  token: string;
};

export type SignupReqType = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_verified_at?: string | null;
  token?: string | null;
  profile?: Profile | null;
};

export type ProfileType = {
  id: number;
  user_id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
};
