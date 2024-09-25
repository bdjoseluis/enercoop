import React, { useEffect, useState } from 'react';
import AxiosInstance from './Axios';
import { useForm, Controller } from 'react-hook-form';
import { Button, Box, Typography, FormHelperText, TextField, Checkbox } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const EditProgramaciones = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { handleSubmit, control, setValue } = useForm();

    useEffect(() => {
        // Obtener los datos de la programación por su ID
        AxiosInstance.get(`programacion/${id}/`).then((response) => {
            // Asignar los datos al formulario
            const data = response.data;
            setValue('nombre', data.nombre);
            setValue('fecha_inicio', dayjs(data.fecha_inicio));
            setValue('fecha_fin', dayjs(data.fecha_fin));
            setValue('periodo', data.periodo);
            setValue('accion', data.accion);
            setValue('automatico', data.automatico);
            setLoading(false);
        }).catch((error) => {
            console.error('Error al obtener los datos de la programación:', error);
            setError('Error al obtener los datos de la programación.');
            setLoading(false);
        });
    }, [id, setValue]);

    const onSubmit = (data) => {
        // Formatear las fechas para enviarlas al backend
        const formattedData = {
            ...data,
            fecha_inicio: dayjs(data.fecha_inicio).format('YYYY-MM-DD'),
            fecha_fin: dayjs(data.fecha_fin).format('YYYY-MM-DD'),
        };

        // Enviar los datos al backend para actualizar la programación
        AxiosInstance.put(`programacion/${id}/`, formattedData).then((response) => {
            console.log('Programación actualizada con éxito:', response.data);
            navigate('/');
        }).catch((error) => {
            console.error('Error al actualizar la programación:', error);
            setError('Error al actualizar la programación. Por favor, inténtalo de nuevo.');
        });
    };

    return (
        <div>
            {loading ? (
                <p>Cargando datos...</p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: 'flex', width: '100%', backgroundColor: '#00003f', marginBottom: '10px' }}>
                        <Typography sx={{ marginLeft: '20px', color: '#fff' }}>
                            Editar Programación
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
                        <Controller
                            name="nombre"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre"
                                    variant="outlined"
                                    placeholder="Asigna un nombre"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                        <Controller
                            name="fecha_inicio"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Fecha de Inicio"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                        <Controller
                            name="fecha_fin"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Fecha de Fin"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                        <Controller
                            name="periodo"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Periodo"
                                    type="number"
                                    variant="outlined"
                                    placeholder="Asigna un periodo"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                        <Controller
                            name="accion"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Acción"
                                    variant="outlined"
                                    placeholder="Asigna una acción"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                        <Controller
                            name="automatico"
                            control={control}
                            render={({ field }) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                    <Checkbox {...field} />
                                    <FormHelperText>¿Automático?</FormHelperText>
                                </Box>
                            )}
                        />

                        {error && (
                            <div style={{ color: 'red', marginBottom: '10px' }}>
                                {error}
                            </div>
                        )}

                        <Button color="primary" variant="contained" type="submit" sx={{ width: '100%' }}>
                            Guardar cambios
                        </Button>
                    </Box>
                </form>
            )}
        </div>
    );
};

export default EditProgramaciones;
