import Grid from '@material-ui/core/Grid';
import Stack from '@mui/material/Stack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {title || 'CONFIRMACIÓN'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              size="medium"
              variant="contained"
              color="default"
              style={{ width: 150 }}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="medium"
              variant="contained"
              color="primary"
              style={{ width: 150 }}
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          </Stack>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
