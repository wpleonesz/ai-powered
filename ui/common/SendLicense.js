import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Spinner from '@ui/common/Spinner';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useRouter } from 'next/router';
import { licenseAssingService } from '@services/licenseAssing.service';

const SendLicense = ({
  name,
  type,
  reason,
  department,
  director,
  licenseId,
  state,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const change = async () => {
    setLoading(true);
    try {
      const data = {
        assingId: director,
        licenseId: licenseId,
      };
      await licenseAssingService.create(data);
      snackbar.success(
        enqueueSnackbar,
        'Se envio la solicitud para su revision y aprobación',
      );
      setOpen(false);
      setTimeout(() => router.reload(), 1000);
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        onClick={handleClickOpen}
        disabled={state != 'draft' ? true : false}
        color="secondary"
      >
        {loading && <Spinner />}
        Enviar
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'SOLICITAR PERMISO'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p align="justify">
              Estimado funcionario(a) <b>{name}</b> está seguro de que quiere
              realizar la siguiente solicitud de <b>{type}</b>, por motivos de{' '}
              <b>{reason}</b>. Si su petición es positiva por parte de los
              revisores, se aprobará caso contrario, será rechazada, además de
              esto recuerde que esta solicitud debe ser revisada y aprobada por
              su Jefe inmediato de <b>{department}</b> y un Analista de Talento
              Humano
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleClose} color="primary">
            CANCELAR
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={change}
            autoFocus
          >
            SOLICITAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SendLicense;
