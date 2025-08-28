/* eslint-disable prettier/prettier */
import { useState } from 'react';
import {
  esES,
  DataGrid as UIDataGrid,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    '& .cold': {
      backgroundColor: '#b9d5ff91',
      color: '#1a3e72',
    },
    '& .hot': {
      backgroundColor: '#ff943975',
      color: '#1a3e72',
    },
  },
});

const DataGrid = ({
  rows,
  columns,
  loading,
  components,
  hideToolbar = false, //oculta la toolbar
  toolbarOptions, // se puede pasar un objeto con las opciones de la toolbar ej: { filter: false }
}) => {
  const [pageSize, setPageSize] = useState(10);
  const classes = useStyles();

  const defaultToolbarOptions = {
    columns: true,
    density: true,
    export: true,
    filter: true,
  };

  const mergedToolbarOptions = { ...defaultToolbarOptions, ...toolbarOptions };

  // Toolbar dinámico según opciones
  const CustomToolbar = () => (
    <div style={{ display: 'flex', gap: 8, padding: 8 }}>
      {mergedToolbarOptions.columns && <GridToolbarColumnsButton />}
      {mergedToolbarOptions.density && <GridToolbarDensitySelector />}
      {mergedToolbarOptions.export && <GridToolbarExport />}
      {mergedToolbarOptions.filter && <GridToolbarFilterButton />}
    </div>
  );

  let componentsToUse = components;
  if (!componentsToUse) {
    componentsToUse = hideToolbar ? {} : { Toolbar: CustomToolbar };
  }

  return (
    <div style={{ width: '100%' }} className={classes.root}>
      <UIDataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        autoHeight
        //editMode
        //editRowsModel
        loading={loading}
        rowsPerPageOptions={[10, 15, 20]}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        components={componentsToUse}
        getCellClassName={(params) => {
          if (
            params.field === 'name' ||
            params.field === 'dni' ||
            params.field === 'id' ||
            params.field === 'Acciones' ||
            params.field === 'workday' ||
            params.field === 'CIInfPer' ||
            params.field === 'epp_id' ||
            params.field === 'epp_facturado' ||
            params.field === 'epp_entidad_bancaria' ||
            params.field === 'epp_usu_registra' ||
            params.field === 'statusMatricula' ||
            params.field === 'idCarr' ||
            params.field === 'datetime' ||
            params.field === 'select' ||
            params.field === 'epp_valor_total' ||
            params.field === 'epp_facturado_estado' ||
            params.field === 'epp_fecha'
          ) {
            return '';
          }
          return params.value === null ? 'hot' : 'cold';
        }}
      />
    </div>
  );
};

export default DataGrid;
