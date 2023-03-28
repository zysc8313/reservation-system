import {
  AppBar,
  AppBarProps,
  Box,
  Button,
  Chip,
  Toolbar,
  Typography,
} from '@mui/material';
import delay from 'delay';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../core/atoms';
import { Logo } from './Logo';

export function AppToolbar(props: AppBarProps): JSX.Element {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);

  return (
    <AppBar
      position="static"
      color="inherit"
      {...props}
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Logo />
        <nav style={{ marginLeft: '20px' }}>
          <Button
            color="inherit"
            sx={{ my: 1, mx: 1.5 }}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          {currentUser && (
            <Button
              color="inherit"
              sx={{ my: 1, mx: 1.5 }}
              onClick={() => navigate('/orders')}
            >
              Orders
            </Button>
          )}
        </nav>

        <Box sx={{ flexGrow: 1 }} component="span" />
        {currentUser ? (
          <>
            <Typography color="inherit" sx={{ fontWeight: 'bold' }}>
              {currentUser.email.split('@')[0]}
            </Typography>
            {currentUser.role && (
              <Chip
                label={currentUser.role}
                color="success"
                size="small"
                sx={{ margin: '0 1em' }}
              />
            )}

            <Button
              color="inherit"
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
              onClick={() => {
                Cookies.remove('token');
                Cookies.remove('user');
                delay(200).then(() => location.reload());
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            color="inherit"
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={() => navigate('/sign-in')}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
