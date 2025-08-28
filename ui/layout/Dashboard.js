import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import UserSettingMenu from '@ui/layout/UserSettingMenu';
import SidebarList from '@ui/layout/SidebarList';
import AppBar from '@ui/layout/AppBar';
import DrawerHeader from '@ui/layout/DrawerHeader';
import Main from '@ui/layout/Main';
import Logo from '@ui/layout/Logo';
import Icon from '@material-ui/core/Icon';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { authService } from '@services/auth.service';
import { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { set } from '@redux/reducers/accessSlice';
import { set as setRoles } from '@redux/reducers/rolesSlice';
import { userService } from '@services/user.service';

const useStyles = makeStyles((_theme) => ({
  titleContainer: {
    color: '#FFF',
    margin: 0,
    fontWeight: 600,
    fontSize: 15,
    lineHeight: 1.2,
    paddingLeft: 0,
    textAlign: 'left',
    wordBreak: 'break-word',
    marginLeft: -5,
    fontFamily: '"Poppins", sans-serif',
    letterSpacing: '0.2px',
  },
  headerMock: {
    width: 280,
    minHeight: 60,
    backgroundColor: '#F8F9FA',
    borderBottom: '1px solid rgba(106, 13, 173, 0.08)',
  },
  contentHeaderMock: {
    minHeight: 60,
  },
  drawer: {
    '& .MuiDrawer-paper': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 20px rgba(106, 13, 173, 0.1)',
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(106, 13, 173, 0.2)',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(106, 13, 173, 0.4)',
      },
    },
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: '1.5rem',
  },
  content: {
    backgroundColor: '#F8F9FA',
  },
  chevronIcon: {
    color: '#FFFFFF',
    fontSize: '24px',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
}));

const drawerWidth = 300;

const Dashboard = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = useState(!isMobile);
  const [user, setUser] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const user = async () => {
      try {
        const user = await authService.public.user();
        setUser(user);
        const access = await userService.getAccess();
        dispatch(set(access || {}));
        const roles = await userService.roles();
        dispatch(setRoles(roles || {}));
      } catch (error) {
        if (error === 'No autorizado' || error === 'Sesión caducada')
          return await router.replace('/auth/signin');
      } finally {
        setLoading(false);
      }
    };
    user();
  }, [dispatch, router]);

  const handleOpen = () => {
    isMobile ? setOpen(!open) : null;
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getCompanyName = () => {
    const name = user?.Institution?.name;
    if (name) return name.toUpperCase();
  };

  const getCompanyIsologo = () => {
    return user?.Institution?.logo;
  };

  if (loading) return <></>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            {open ? (
              <Typography></Typography>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                size="medium"
                xs={{ md: 2 }}
              >
                <MenuIcon className={classes.menuIcon} />
              </IconButton>
            )}
          </Box>
          <UserSettingMenu user={user} />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={0}
            style={{ flexGrow: 1 }}
          >
            <Grid item style={{ width: '80px', paddingRight: 0 }}>
              <Logo logo={getCompanyIsologo()} />
            </Grid>
            <Grid item xs style={{ paddingLeft: 0 }}>
              <div className={classes.titleContainer}>{getCompanyName()}</div>
            </Grid>
          </Grid>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <Icon className={classes.chevronIcon}>chevron_left</Icon>
            ) : (
              <Icon className={classes.chevronIcon}>chevron_right</Icon>
            )}
          </IconButton>
        </DrawerHeader>
        <div className={classes.headerMock}></div>
        <List>
          <SidebarList handleOpen={handleOpen} />
        </List>
      </Drawer>
      <Main open={open} className={classes.content}>
        <div className={classes.contentHeaderMock}></div>
        {props.children}
      </Main>
    </Box>
  );
};

export default Dashboard;
