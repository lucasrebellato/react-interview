import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Container, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SignalRProvider } from '../contexts/signalRContext';
import GenericTitle from '../shared/components/genericTitle';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <GenericTitle text="TodoApp" variant='h6'/>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <SignalRProvider>
          <Outlet />
        </SignalRProvider>
      </Container>
    </>
  );
}