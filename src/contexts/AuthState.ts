interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
  token?: string | null;
  profile?: Profile | null;
}

interface Profile {
  id?: number;
  user_id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "UPDATE_PICTURE"; payload: string }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "LOAD_USER_FROM_STORAGE"; payload: User | null };
