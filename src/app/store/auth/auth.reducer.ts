import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState, User } from '../../core/models';

const savedUserJson = localStorage.getItem('user');
const savedUser: User | null = savedUserJson
  ? (JSON.parse(savedUserJson) as User)
  : null;
const tokenExists = !!localStorage.getItem('token');

const initialState: AuthState = {
  user: savedUser,
  loading: false,
  error: null,
  isAuthenticated: tokenExists,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    isAuthenticated: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
  })),
  on(AuthActions.checkAuthSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: !!user,
  })),
);
