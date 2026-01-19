import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { ApiErrorHandler } from './components/Notify';
import { AuthProvider } from './context/AuthContext';
import { LoadingOverlay } from './layouts/components';
import { getRouter } from './router';
import './styles/index.styl';
// gravity-ui config
import { settings as settingsGravityDate } from '@gravity-ui/date-utils';
import {
  configure as configGravityUI,
  ThemeProvider,
  Toaster,
  ToasterComponent,
  ToasterProvider,
} from '@gravity-ui/uikit';
import { store } from './store/store';

configGravityUI({
  lang: 'ru',
});
settingsGravityDate.loadLocale('ru').then(() => {
  settingsGravityDate.setLocale('ru');
});

/**
 * Компонент приложения
 */
const App: React.FC = () => {
  const toaster = new Toaster();

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme="light">
          <ToasterProvider toaster={toaster}>
            <ApiErrorHandler>
              <RouterProvider router={getRouter()} />
              <LoadingOverlay />
              <ToasterComponent />
            </ApiErrorHandler>
          </ToasterProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

/** Рендер приложения */
export const bootApp = () => {
  const rootNode = document.getElementById('root');
  const root = createRoot(rootNode!);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
