import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { personService } from 'services/person.service';
import PersonForm from './PersonForm';

const PersonList = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPersons = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await personService.getAll();
      if (response) {
        setPersons(response);
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de personas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleEdit = (personId) => {
    setSelectedPersonId(personId);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedPersonId(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (person) => {
    setPersonToDelete(person);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await personService.remove(personToDelete.id);
      setIsDeleteConfirmOpen(false);
      loadPersons();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar la persona');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    loadPersons();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      loadPersons();
      return;
    }

    try {
      setLoading(true);
      const response = await personService.getByDni(searchTerm);
      if (response) {
        // Si la respuesta es un solo objeto, lo convertimos en array
        setPersons(Array.isArray(response) ? response : [response]);
      } else {
        setPersons([]);
      }
    } catch (err) {
      console.error(err);
      setPersons([]);
      setError('No se encontraron resultados');
    } finally {
      setLoading(false);
    }
  };

  const filteredPersons = persons.filter(
    (person) =>
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Gestión de Personas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleCreate}
        >
          Nueva Persona
        </Button>
      </Box>

      <Box display="flex" mb={2}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, DNI o email"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>DNI</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredPersons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              filteredPersons.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>{person.dni}</TableCell>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.mobile}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEdit(person.id)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteConfirm(person)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para confirmar eliminación */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar a {personToDelete?.name}? Esta
            acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para el formulario */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <PersonForm personId={selectedPersonId} onSave={handleFormSave} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonList;
