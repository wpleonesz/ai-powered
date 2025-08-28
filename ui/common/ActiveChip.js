import React from 'react';
import { Chip } from '@mui/material';

const ActiveChip = ({ active, ...props }) => {
  return (
    <Chip
      label={active ? 'Activo' : 'Inactivo'}
      color={active ? 'success' : 'error'}
      size="small"
      {...props}
    />
  );
};

export default ActiveChip;
