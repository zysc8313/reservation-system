import { CircularProgress, GlobalStyles } from '@mui/material';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AppToolbar } from './components/AppToolbar';

export function AppLayout(): JSX.Element {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          '#root': {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          },
        }}
      />
      <React.Suspense
        fallback={
          <CircularProgress
            size={80}
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        }
      >
        <AppToolbar />
        <Outlet />
      </React.Suspense>
    </React.Fragment>
  );
}
