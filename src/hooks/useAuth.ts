import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  return { ...auth, dispatch };
}

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  return { ...cart, dispatch };
}