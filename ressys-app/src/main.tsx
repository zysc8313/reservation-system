import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Cookies from 'js-cookie';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { currentUserState } from './core/atoms';
import { router } from './routes/index';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/',
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const initializeState = (mutableSnapshot: MutableSnapshot) => {
  const user = Cookies.get('user');
  if (user) {
    try {
      mutableSnapshot.set(currentUserState, JSON.parse(user));
    } catch (_) {
      Cookies.remove('user');
    }
  }
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RecoilRoot initializeState={initializeState}>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <RouterProvider router={router} />
            </ThemeProvider>
          </LocalizationProvider>
        </SnackbarProvider>
      </RecoilRoot>
    </ApolloProvider>
  </React.StrictMode>
);
