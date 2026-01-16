import { configureStore } from '@reduxjs/toolkit';
import { enhancedApi } from './enhancedApi';
import profileReducer from './slices/profileSlice';
import viewportReducer from './slices/viewportSlice';

export const store = configureStore({
  reducer: {
    authUser: profileReducer,
    appViewport: viewportReducer,
    [enhancedApi.reducerPath]: enhancedApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(enhancedApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
