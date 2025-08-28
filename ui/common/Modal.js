import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import theme from '@styles/theme';
import 'react-quill/dist/quill.core.css';

const Modal = ({ title, label, content, description }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" style={theme.palette.show} onClick={handleClickOpen}>
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              <b>{description}:</b>
            </p>
            <div
              className="view ql-editor"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleClose} color="primary">
            CANCELAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Modal;
