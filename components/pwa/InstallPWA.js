import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
  installButton: {
    margin: theme.spacing(1),
  },
  snackbar: {
    [theme.breakpoints.down('xs')]: {
      bottom: 90,
    },
  },
  snackbarContent: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const InstallPWA = () => {
  const classes = useStyles();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPromotion, setShowInstallPromotion] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowInstallPromotion(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    // Hide the app provided install promotion
    setShowInstallPromotion(false);
    // Show the install prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó la instalación de la PWA');
        } else {
          console.log('Usuario rechazó la instalación de la PWA');
        }
        // Clear the deferredPrompt variable
        setDeferredPrompt(null);
      });
    }
  };

  const handleClose = () => {
    setShowInstallPromotion(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={showInstallPromotion}
      onClose={handleClose}
      message="Instala la app UEA para un acceso más rápido"
      className={classes.snackbar}
      ContentProps={{
        className: classes.snackbarContent,
      }}
      action={
        <>
          <Button
            color="inherit"
            size="small"
            onClick={handleInstallClick}
            startIcon={<GetAppIcon />}
            className={classes.installButton}
          >
            Instalar
          </Button>
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};

export default InstallPWA;
