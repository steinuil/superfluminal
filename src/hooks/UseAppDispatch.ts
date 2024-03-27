import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store';

export default function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
