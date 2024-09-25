import React, { useEffect, useState, useCallback } from 'react';
import AxiosInstance from './Axios';
import { Box, Checkbox, Button, Typography, CircularProgress, Alert, Grid, Collapse } from '@mui/material';

const AsignarContadores = ({ id, onContadoresChange }) => {
    const [contadores, setContadores] = useState([]);
    const [selectedContadores, setSelectedContadores] = useState([]);
    const [selectedProgramacion, setSelectedProgramacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [expanded, setExpanded] = useState(false); // Estado para controlar la expansión de la información detallada

    // Función para obtener la lista de contadores desde el backend
    const fetchContadores = useCallback(() => {
        AxiosInstance.get('contador/')
            .then((response) => {
                setContadores(response.data);
            })
            .catch((error) => {
                setError('Error al obtener los datos de contadores.');
                console.error('Error al obtener los datos de contadores:', error);
            });
    }, []);

    // Función para obtener la programación según el ID
    const fetchProgramacion = useCallback(() => {
        if (!id) {
            setError('ID de programación no proporcionado.');
            setLoading(false);
            return;
        }

        AxiosInstance.get(`programacion/${id}/`)
            .then((response) => {
                const programacionData = response.data;
                setSelectedProgramacion(programacionData);
                setSelectedContadores(programacionData.contadores || []);
            })
            .catch((error) => {
                setError('Error al obtener la programación seleccionada.');
                console.error('Error al obtener la programación seleccionada:', error);
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Llamadas a las funciones para obtener los datos iniciales
    useEffect(() => {
        fetchContadores();
        fetchProgramacion();
    }, [fetchContadores, fetchProgramacion]);

    // Función para manejar la selección de un contador
    const handleContadorChange = (event, contadorId) => {
        if (event.target.checked) {
            // Añadir el contador a la lista seleccionada
            setSelectedContadores((prev) => [...prev, contadorId]);
        } else {
            // Eliminar el contador de la lista seleccionada
            setSelectedContadores((prev) => prev.filter((id) => id !== contadorId));
        }
    };

    // Función para guardar los cambios en los contadores asignados y en la programación seleccionada
    const handleSave = async () => {
        setSaving(true);
        
        // Combina los datos de la programación seleccionada con los contadores seleccionados
        const updatedProgramacion = {
            ...selectedProgramacion,
            contadores: selectedContadores,
        };

        try {
            // Guarda la programación actualizada
            await AxiosInstance.put(`programacion/${id}/`, updatedProgramacion);
            
            // Obtener los contadores anteriores y los nuevos contadores seleccionados
            const contadoresAnteriores = new Set(selectedProgramacion.contadores);
            const contadoresNuevos = new Set(selectedContadores);

            // Crear un conjunto unido de contadores anteriores y nuevos
            const contadoresUnidos = new Set([...contadoresAnteriores, ...contadoresNuevos]);

            // Actualizar cada contador según si fue añadido o eliminado
            for (const contadorId of contadoresUnidos) {
                const response = await AxiosInstance.get(`contador/${contadorId}/`);
                const contadorData = response.data;

                // Si el contador ha sido añadido a la lista
                if (contadoresNuevos.has(contadorId) && !contadoresAnteriores.has(contadorId)) {
                    // Añadir la programación a la lista de programaciones del contador
                    contadorData.programaciones.push(id);
                }

                // Si el contador ha sido eliminado de la lista
                if (contadoresAnteriores.has(contadorId) && !contadoresNuevos.has(contadorId)) {
                    // Quitar la programación de la lista de programaciones del contador
                    contadorData.programaciones = contadorData.programaciones.filter(progId => progId !== id);
                }

                // Guarda el contador actualizado
                await AxiosInstance.put(`contador/${contadorId}/`, contadorData);
            }

            setSuccess(true);
            if (onContadoresChange) {
                onContadoresChange(selectedContadores);
            }
        } catch (error) {
            setError('Error al guardar los cambios en la programación o en los contadores.');
            console.error('Error al guardar los cambios en la programación o en los contadores:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>Asignar contadores</Typography>
            
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {/* Mostrar el nombre de la programación como un campo desplegable */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        onClick={() => setExpanded(!expanded)} // Cambiar el estado de expansión al hacer clic en el nombre
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Programación: {selectedProgramacion ? selectedProgramacion.nombre : 'Seleccionar una programación'}
                    </Typography>
                    {/* Mostrar la información detallada si está expandida */}
                    <Collapse in={expanded && !!selectedProgramacion}>
                        {selectedProgramacion && (
                            <div>
                                <Typography><strong>Fecha de Inicio:</strong> {selectedProgramacion.fecha_inicio}</Typography>
                                <Typography><strong>Fecha de Fin:</strong> {selectedProgramacion.fecha_fin}</Typography>
                                <Typography><strong>Periodo:</strong> {selectedProgramacion.periodo}</Typography>
                                <Typography><strong>Acción:</strong> {selectedProgramacion.accion}</Typography>
                                <Typography><strong>Contadores Asignados:</strong> {selectedProgramacion.contadores.join(', ')}</Typography>
                            </div>
                        )}
                    </Collapse>

                    {/* Lista de contadores disponibles para asignar */}
                    <Box sx={{ marginTop: '16px' }}>
                        <Grid container spacing={2}>
                            {contadores.map((contador) => (
                                <Grid item xs={12} sm={6} md={3} key={contador.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={selectedContadores.includes(contador.id)}
                                            onChange={(event) => handleContadorChange(event, contador.id)}
                                            disabled={saving}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                                            {/* Mostrar la IP del contador */}
                                            <Typography variant="body1">IP: {contador.ip}</Typography>
                                            {/* Mostrar el número de serie del contador */}
                                            <Typography variant="body1">Número de Serie: {contador.num_serie}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Mensajes de éxito o error */}
                    {error && (
                        <Alert severity="error">{error}</Alert>
                    )}
                    {success && (
                        <Alert severity="success">Cambios guardados con éxito</Alert>
                    )}

                    {/* Botón para guardar los cambios */}
                    <Box sx={{ marginTop: '16px' }}>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            color="primary"
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </Box>
                </>
            )}
        </div>
    );
};

export default AsignarContadores;
