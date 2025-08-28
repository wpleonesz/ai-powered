import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormHelperText,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { userService } from 'services/user.service';
import { personService } from 'services/person.service';

const schema = yup.object().shape({
  dni: yup.string().required('DNI es requerido'),
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido'),
  mobile: yup.string(),
  address: yup.string(),
  gender: yup.string(),
  nationality: yup.string(),
  occupation: yup.string(),
});

const PersonForm = ({ personId, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [birthDate, setBirthDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Si tenemos un ID de persona, cargamos sus datos
    if (personId) {
      const loadPerson = async () => {
        try {
          setLoading(true);
          const personData = await personService.getById(personId);

          if (personData) {
            setValue('dni', personData.dni);
            setValue('firstName', personData.firstName);
            setValue('lastName', personData.lastName);
            setValue('email', personData.email);
            setValue('mobile', personData.mobile);
            setValue('address', personData.address);
            setValue('gender', personData.gender);
            setValue('nationality', personData.nationality);
            setValue('occupation', personData.occupation);

            if (personData.birthDate) {
              setBirthDate(new Date(personData.birthDate));
            }
          }
        } catch (err) {
          console.error(err);
          setError('Error al cargar datos de la persona');
        } finally {
          setLoading(false);
        }
      };

      loadPerson();
    }
  }, [personId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const personData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        birthDate: birthDate ? birthDate.toISOString() : null,
      };

      let response;

      if (personId) {
        // Actualizar persona existente
        response = await personService.update(personId, personData);
      } else {
        // Crear nueva persona
        response = await userService.createPerson(personData);
      }

      if (response) {
        if (onSave) onSave(response);
        if (!personId) reset(); // Solo limpiamos el formulario si es una nueva persona
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al guardar datos de la persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {personId ? 'Editar Persona' : 'Registrar Persona'}
        </Typography>

        {error && (
          <Typography color="error" variant="subtitle1" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider style={{ marginBottom: '10px' }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('dni')}
                error={!!errors.dni}
                helperText={errors.dni?.message}
                fullWidth
                label="DNI"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
                label="Nombre"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
                label="Apellido"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('mobile')}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                fullWidth
                label="Teléfono Móvil"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" disabled={loading}>
                <InputLabel id="gender-label">Género</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Género"
                  {...register('gender')}
                  defaultValue=""
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                  <MenuItem value="O">Otro</MenuItem>
                </Select>
                {errors.gender && (
                  <FormHelperText error>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                fullWidth
                label="Dirección"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha de Nacimiento"
                  value={birthDate}
                  onChange={(newValue) => {
                    setBirthDate(newValue);
                  }}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('nationality')}
                error={!!errors.nationality}
                helperText={errors.nationality?.message}
                fullWidth
                label="Nacionalidad"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('occupation')}
                error={!!errors.occupation}
                helperText={errors.occupation?.message}
                fullWidth
                label="Ocupación"
                variant="outlined"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading
                    ? 'Guardando...'
                    : personId
                    ? 'Actualizar'
                    : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PersonForm;
