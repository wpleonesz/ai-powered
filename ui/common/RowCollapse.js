/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
//import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
const StatesAcademic = (
  califcn,
  anld,
  mssgAnld,
  asistencia,
  estado,
  notaMin,
  asistenciaMin,
  notaSupl,
  aprob,
  pxa,
) => {
  if (estado === 1 || estado === 0) {
    if (anld === 0) {
      if (califcn >= notaMin && asistencia >= asistenciaMin && aprob === 1) {
        return <Chip size="small" color="primary" label="APROBADO" />;
      } else if (
        califcn >= notaSupl &&
        califcn < notaMin &&
        asistencia >= asistenciaMin &&
        aprob === 0
      ) {
        return <Chip size="small" color="default" label="SUPLETORIO" />;
      } else if (califcn < notaMin && asistencia >= asistenciaMin) {
        return <Chip size="small" color="secondary" label={`REPROBADO`} />;
      } else if (
        califcn >= notaMin &&
        asistencia < asistenciaMin &&
        pxa === 1
      ) {
        return (
          <Chip
            size="small"
            color="secondary"
            label={`REPROBADO POR ASISTENCIA ${asistencia}%`}
          />
        );
      } else if (califcn === null && asistencia === null) {
        return <Chip size="small" color="default" label="EN CURSO" />;
      } else {
        return <Chip size="small" color="default" label="EN CURSO" />;
      }
    } else {
      return <Chip size="small" color="secondary" label={mssgAnld} />;
    }
  } else {
    return <Chip size="small" color="default" label="EN CURSO" />;
  }
};
const RowCollapse = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell style={{ width: '5%' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            colSpan={3}
            style={{ width: '45%' }}
          >
            <b>MATERIA: </b> {row?.nombAsig}
          </TableCell>
          <TableCell component="th" scope="row" style={{ width: '20%' }}>
            <b>PARALELO: </b> {row?.idParalelo}
          </TableCell>
          <TableCell component="th" scope="row" style={{ width: '20%' }}>
            <b>ESTADO: </b>
            {StatesAcademic(
              row?.CalifFinal,
              row?.anulada,
              row?.observacion,
              row?.asistencia,
              row?.estado,
              row?.notaMin,
              row?.asistenciaMin,
              row?.notaSupl,
              row?.aprobada,
              row?.pxa,
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography>
                  <b>CALIFICACIONES</b>
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead></TableHead>
                  <TableBody>
                    {row?.score.map((item) => (
                      <>
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <b>{item?.cfpaa_desceval}</b>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            <b>C.A.D (15)</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>C.A.P.E (7.5)</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>C.A.A (7.5)</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>E.P (20)</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>TOTAL</b>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            {item?.cfpaa_acd}
                          </TableCell>
                          <TableCell align="center">
                            {item?.cfpaa_apa}
                          </TableCell>
                          <TableCell align="center">
                            {item?.cfpaa_ape}
                          </TableCell>
                          <TableCell align="center">
                            {item?.cfpaa_pra}
                          </TableCell>
                          <TableCell align="center">
                            {item?.cfpaa_calificacion}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    {row?.CSP !== null || row?.CSP2 !== null ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            <b>TOTAL (T):</b>
                          </TableCell>
                          <TableCell align="center">
                            {row?.TCAC !== null
                              ? row?.TCAC
                              : row?.cfpaa_estado === 1
                              ? `${row?.score
                                  ?.map((item) => item?.cfpaa_calificacion)
                                  .reduce((prev, curr) => prev + curr, 0)}`
                              : `${row?.score
                                  ?.map((item) => item?.cfpaa_calificacion)
                                  .reduce((prev, curr) => prev + curr, 0)}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            <b>RECUPERACIÓN (R):</b>
                          </TableCell>
                          <TableCell align="center">{row?.CSP}</TableCell>
                        </TableRow>
                        {/*<TableRow>
                          <TableCell colSpan={4} align="right">
                            <b>(T + R) / 2:</b>
                          </TableCell>
                          <TableCell align="center">
                            {Math.round(((row?.TCAC + row?.CSP) / 2) * 10) / 10}
                          </TableCell>
                        </TableRow>*/}
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            <b>TOTAL DEL SEMESTRE:</b>
                          </TableCell>
                          <TableCell align="center">
                            {row?.CalifFinal !== null
                              ? row?.CalifFinal
                              : row?.cfpaa_estado === 1
                              ? `${row?.score
                                  ?.map((item) => item?.cfpaa_calificacion)
                                  .reduce((prev, curr) => prev + curr, 0)}`
                              : `${row?.score
                                  ?.map((item) => item?.cfpaa_calificacion)
                                  .reduce((prev, curr) => prev + curr, 0)}`}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <b>TOTAL DEL SEMESTRE:</b>
                        </TableCell>
                        <TableCell align="center">
                          {row?.CalifFinal !== null
                            ? row?.CalifFinal
                            : row?.cfpaa_estado === 1
                            ? `${row?.score
                                ?.map((item) => item?.cfpaa_calificacion)
                                .reduce((prev, curr) => prev + curr, 0)}`
                            : `${row?.score
                                ?.map((item) => item?.cfpaa_calificacion)
                                .reduce((prev, curr) => prev + curr, 0)}`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    </>
  );
};

export default RowCollapse;
