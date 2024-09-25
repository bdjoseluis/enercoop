import React, { useEffect, useState } from 'react';
import AxiosInstance from './Axios';
import { Box, Typography, CircularProgress, Alert, ButtonGroup, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useForm } from 'react-hook-form';

const VerProgramacion = ({ id, updateData }) => {
    const [programaciones, setProgramaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProgramacion, setSelectedProgramacion] = useState(null);

    const obtenerProgramacionesAsignadas = async () => {
        try {
            if (!id) {
                setLoading(false);
                return;
            }

            const response = await AxiosInstance.get(`contador/${id}/`);
            const contadorData = response.data;
            const programacionesAsignadas = contadorData.programaciones;

            const programacionesDetalles = await Promise.all(programacionesAsignadas.map(async programacionId => {
                const programacionResponse = await AxiosInstance.get(`programacion/${programacionId}/`);
                return programacionResponse.data;
            }));

            setProgramaciones(programacionesDetalles);
            setSelectedProgramacion(programacionesDetalles[0] || null);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener programaciones asignadas:', error);
            setError('Error al obtener programaciones asignadas');
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerProgramacionesAsignadas();
    }, [id]);

    const handleProgramacionSelect = (event) => {
        const selectedId = event.target.value;
        const selected = programaciones.find(prog => prog.id === selectedId);
        setSelectedProgramacion(selected);
    };

    const handleInputChange = (event, field) => {
        const { value } = event.target;
        const updatedProgramaciones = programaciones.map(programacion => {
            if (programacion.id === selectedProgramacion.id) {
                return { ...programacion, [field]: value };
            }
            return programacion;
        });
        setProgramaciones(updatedProgramaciones);
    };

    const handleDesasignarProgramacion = async () => {
        try {
            const updatedProgramacion = { ...selectedProgramacion };
            updatedProgramacion.contadores = updatedProgramacion.contadores.filter(contadorId => contadorId !== id);

            const responseContador = await AxiosInstance.get(`contador/${id}/`);
            const contadorData = responseContador.data;

            contadorData.programaciones = contadorData.programaciones.filter(progId => progId !== selectedProgramacion.id);
            await AxiosInstance.put(`contador/${id}/`, contadorData);

            const updatedProgramacionesDetalles = await Promise.all(contadorData.programaciones.map(async programacionId => {
                const programacionResponse = await AxiosInstance.get(`programacion/${programacionId}/`);
                return programacionResponse.data;
            }));

            setProgramaciones(updatedProgramacionesDetalles);

            const responseProgramacion = await AxiosInstance.put(`programacion/${selectedProgramacion.id}/`, updatedProgramacion);

            setProgramaciones(programaciones.map(prog => {
                if (prog.id === selectedProgramacion.id) {
                    return responseProgramacion.data;
                }
                return prog;
            }));
            setSelectedProgramacion(null);
            updateData();
        } catch (error) {
            console.error('Error al desasignar la programación:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await AxiosInstance.put(`programacion/${selectedProgramacion.id}/`, selectedProgramacion);
            console.log('Programación actualizada:', response.data);
            setProgramaciones(prev => prev.map(prog => prog.id === selectedProgramacion.id ? response.data : prog));
        } catch (error) {
            console.error('Error al actualizar la programación:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (programaciones.length === 0) {
        return <Typography>No se encontraron programaciones asignadas para el contador</Typography>;
    }

    return (
        <Box display="flex">
            <Box flex="1" pr={2}>
                <Typography variant="h5">Programaciones Asignadas al Contador ID: {id}</Typography>
                <FormControl fullWidth>
                    <InputLabel>Programación</InputLabel>
                    <Select
                        value={selectedProgramacion ? selectedProgramacion.id : ''}
                        onChange={handleProgramacionSelect}
                        label="Programación"
                    >
                        {programaciones.map(programacion => (
                            <MenuItem key={programacion.id} value={programacion.id}>
                                {programacion.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box flex="2">
                {selectedProgramacion && (
                    <ProgramacionDetalles
                        programacion={selectedProgramacion}
                        handleInputChange={handleInputChange}
                        handleUpdate={handleUpdate}
                        handleDesasignarProgramacion={handleDesasignarProgramacion}
                    />
                )}
            </Box>
        </Box>
    );
};

const ProgramacionDetalles = ({ programacion, handleInputChange, handleUpdate, handleDesasignarProgramacion }) => {
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        reset(programacion);
    }, [programacion, reset]);

    const onSubmit = (data) => {
        console.log('Datos actualizados:', data);
    };

    return (
        <Box>
            <Typography variant="h6">Detalles de la Programación ID: {programacion.id}</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <Typography variant="body1">Nombre:</Typography>
                    <input
                        type="text"
                        {...register('nombre')}
                        defaultValue={programacion.nombre}
                        onChange={(event) => handleInputChange(event, 'nombre')}
                    />
                </Box>
                <Box>
                    <Typography variant="body1">Fecha de Inicio:</Typography>
                    <input
                        type="date"
                        {...register('fecha_inicio')}
                        defaultValue={programacion.fecha_inicio}
                        onChange={(event) => handleInputChange(event, 'fecha_inicio')}
                    />
                </Box>
                <Box>
                    <Typography variant="body1">Fecha de Fin:</Typography>
                    <input
                        type="date"
                        {...register('fecha_fin')}
                        defaultValue={programacion.fecha_fin}
                        onChange={(event) => handleInputChange(event, 'fecha_fin')}
                    />
                </Box>
                <Box>
                    <Typography variant="body1">Periodo:</Typography>
                    <input
                        type="number"
                        {...register('periodo')}
                        defaultValue={programacion.periodo}
                        onChange={(event) => handleInputChange(event, 'periodo')}
                    />
                </Box>
                <Box>
                    <Typography variant="body1">Automático:</Typography>
                    <select
                        {...register('automatico')}
                        defaultValue={programacion.automatico ? 'true' : 'false'}
                        onChange={(event) => handleInputChange(event, 'automatico')}
                    >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </Box>
                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        type="button"
                        onClick={handleUpdate}
                        sx={{ marginRight: 2 }}
                    >
                        Actualizar Programación
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        type="button"
                        onClick={handleDesasignarProgramacion}
                    >
                        Desasignar Programación
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default VerProgramacion;
