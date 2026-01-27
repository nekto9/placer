import { UseViewportSizeResult } from '@gravity-ui/uikit';
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

const initialState: {
  size?: UseViewportSizeResult;
} = { size: undefined };

/** Размеры экрана храним глобально, переопределяем в DefaultLayout */
export const viewportSlice = createSlice({
  name: 'appViewport',
  initialState,
  selectors: { isDesktop: (state) => state.size?.width > 1024 },
  reducers: {
    setViewportSize: (state, action: PayloadAction<UseViewportSizeResult>) => {
      state.size = action.payload;
    },
  },
});

export const { isDesktop } = viewportSlice.selectors;
export const { setViewportSize } = viewportSlice.actions;

const viewportReducer: Reducer<typeof initialState> = viewportSlice.reducer;
export default viewportReducer;
