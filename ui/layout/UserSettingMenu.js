import IconButton from '@material-ui/core/IconButton';
import SettingsApplicationsIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
//import Box from '@material-ui/core/Box'; // No longer used
import { useState } from 'react';
import { makeStyles, alpha } from '@material-ui/core';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { authService } from '@services/auth.service';

const useStyle = makeStyles((theme) => ({
  userButton: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 1),
    transition: 'all 0.3s ease',
    '&:hover': {
      background: alpha(theme.palette.common.white, 0.1),
    },
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    letterSpacing: '0.02em',
    textTransform: 'capitalize',
  },
  userIcon: {
    color: theme.palette.common.white,
    fontSize: 20,
  },
  menu: {
    marginTop: theme.spacing(1),
    boxShadow: theme.shadows[3],
    '& .MuiPaper-root': {
      borderRadius: 8,
      minWidth: 200,
      overflow: 'hidden',
    },
  },
  menuItem: {
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: theme.spacing(1.8, 2.5),
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    '& svg': {
      marginRight: theme.spacing(1.8),
      fontSize: '1.25rem',
      color: theme.palette.text.secondary,
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

const UserSettingMenu = ({ user }) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = async () => {
    try {
      await authService.signout();
      await router.replace('/auth/signin');
    } catch (error) {}
  };

  return (
    <>
      <IconButton
        className={classes.userButton}
        aria-label="cuenta del usuario actual"
        aria-controls="menu-perfil"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <SettingsApplicationsIcon className={classes.userIcon} />
        {!isMobile && (
          <Typography className={classes.userName} component="span">
            {user.Person?.name || user.username}
          </Typography>
        )}
      </IconButton>

      <Menu
        id="menu-perfil"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Grow}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            handleClose();
            router.push('/');
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>

        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            handleClose();
            signOut({ callbackUrl: `${process.env.BASE_URL}/auth/signin` });
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  );
};
export default UserSettingMenu;
