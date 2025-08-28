import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import DataGrid from '@ui/common/DataGrid';
import States from '@ui/common/States';
import { useState } from 'react';
import { dates } from '@lib/dates';

const parseRows = (rows) => {
  const data = [];
  rows.map((row) => {
    if (row?.active === true) {
      data.push({
        ...row,
        id: row.id,
        checkers: row.User?.department[0]?.name,
        state: row.licenseChecker[0]?.state,
        requestDate: row.licenseChecker[0]?.requestDate,
        approvalDate: row.licenseChecker[0]?.approvalDate,
      });
    }
  });
  return data;
};

const field = (field, name, renderCell) => {
  return {
    field: field,
    headerName: name,
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    renderCell,
    filterable: false,
    sortable: false,
  };
};

const ShowAssing = ({ rows, loading }) => {
  rows = parseRows(rows);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let column = [
    field('checkers', 'Revisor', (cell) => {
      return cell.row.checkers === undefined
        ? 'ANALISTA DE TTHH'
        : cell.row.checkers;
    }),
    field('approvalDate', 'Fecha Aprobación/Rechazo', (cell) => {
      return cell.row.approvalDate === null ||
        cell.row.approvalDate === undefined
        ? cell.row.requestDate === undefined
          ? 'NO REVISADO'
          : dates.toString(cell.row.requestDate)
        : cell.row.approvalDate === undefined
        ? 'NO REVISADO'
        : dates.toString(cell.row.approvalDate);
    }),
    field('state', 'Estado', (cell) => {
      return cell.row.state === undefined ? (
        'NO REVISADO'
      ) : (
        <States code={cell.row.state} />
      );
    }),
  ];

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        onClick={handleClickOpen}
        color="primary"
      >
        <RemoveRedEyeIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'FLUJO DE APROBACIÓN O RECHAZO DE PERMISO'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DataGrid rows={rows} columns={column} loading={loading} />
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

export default ShowAssing;
