import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, setAccessToken } from '@/api/axios';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message ?? 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message ?? 'Login failed'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

export const refreshAuth = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data.data;
    } catch {
      return rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      setAccessToken(null);
    });

    // Refresh (silent session restore on app load)
    builder
      .addCase(
        refreshAuth.fulfilled,
        (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
          state.accessToken = action.payload.accessToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.isInitialized = true;
          setAccessToken(action.payload.accessToken);
        }
      )
      .addCase(refreshAuth.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        setAccessToken(null);
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;