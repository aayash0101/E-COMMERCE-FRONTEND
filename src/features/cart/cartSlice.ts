import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/axios';
import { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data.data.cart as Cart;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (
    data: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/cart', data);
      return response.data.data.cart as Cart;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to add item');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (
    data: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/cart/${data.productId}`, {
        quantity: data.quantity,
      });
      return response.data.data.cart as Cart;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data.data.cart as Cart;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState(state) {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: CartState) => {
      state.isLoading = true;
      state.error = null;
    };

    const setCart = (
      state: CartState,
      action: PayloadAction<Cart>
    ) => {
      state.isLoading = false;
      state.cart = action.payload;
    };

    const setError = (state: CartState, action: PayloadAction<unknown>) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)
      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, setError)
      .addCase(removeFromCart.pending, setLoading)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, setError)
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
        state.isLoading = false;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;