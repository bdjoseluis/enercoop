import React, { useState } from 'react';
import AxiosInstance from './Axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const DeleteProgramaciones = () => {
    const { id } = useParams(); // Obtiene el ID de la programación desde la URL
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    // Función para manejar la apertura del diálogo de confirmación
    const handleOpen = () => {
        setOpen(true);
    };

    // Función para manejar el cierre del diálogo de confirmación
    const handleClose = () => {
        setOpen(false);
    };

    // Función para eliminar la programación
    const handleDelete = () => {
        AxiosInstance.delete(`programacion/${id}/`)
            .then(() => {
                // Redirigir a la página principal después de eliminar la programación
                navigate('/');
            })
            .catch((error) => {
                console.error('Error al eliminar la programación:', error);
                setError('Error al eliminar la programación. Por favor, inténtalo de nuevo.');
            })
            .finally(() => {
                handleClose(); // Cerrar el diálogo después de la eliminación
            });
    };

    return (
        <div>
            <Button color="error" variant="contained" onClick={handleOpen}>
                Eliminar Programación
            </Button>

            {/* Diálogo de confirmación */}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar esta programación?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Mostrar un mensaje de error si hay algún error */}
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </div>
    );
};

export default DeleteProgramaciones;
