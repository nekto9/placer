import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponseDto } from '@/store/api';

const initialState: {
  user?: UserResponseDto;
} = { user: undefined };

/** Залогиненного пользователя храним без хуков */
export const profileSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<UserResponseDto>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = profileSlice.actions;
export default profileSlice.reducer;
