import React, { useEffect, useState } from 'react';
import AxiosInstance from './Axios';
import { Button, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';

const AsignarProgramacion = ({ id }) => {
    const [availableProgramaciones, setAvailableProgramaciones] = useState([]);
    const [selectedProgramacion, setSelectedProgramacion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchAvailableProgramaciones = async () => {
            try {
                const response = await AxiosInstance.get('programacion/');
                setAvailableProgramaciones(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener programaciones disponibles:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchAvailableProgramaciones();
    }, []);

    const handleProgramacionChange = (event) => {
        setSelectedProgramacion(event.target.value);
    };

    const handleAssignProgramacion = async () => {
        if (selectedProgramacion) {
            try {
                // Primero, obtenemos los datos completos del contador
                const responseContador = await AxiosInstance.get(`contador/${id}/`);
                const contadorData = responseContador.data;
    
                // Obtenemos los datos completos de la programación seleccionada
                const responseProgramacion = await AxiosInstance.get(`programacion/${selectedProgramacion}/`);
                const programacionData = responseProgramacion.data;
    
                // Asignamos la programación al contador
                contadorData.programaciones.push(selectedProgramacion);
                
                // Asignamos el contador a la programación
                programacionData.contadores.push(id);
    
                // Realizamos las solicitudes PUT para actualizar los datos del contador y la programación
                await AxiosInstance.put(`contador/${id}/`, contadorData);
                await AxiosInstance.put(`programacion/${selectedProgramacion}/`, programacionData);
    
                setSuccess(true);
                console.log('Programación asignada correctamente');
    
                // Limpia el estado de la selección
                setSelectedProgramacion('');
                setError(null);
            } catch (error) {
                console.error('Error al asignar programación:', error);
                setError(error);
                setSuccess(false);
            }
        }
    };
    
    

    if (loading) {
        return <p>Cargando programaciones...</p>;
    }

    return (
        <div>
            <h3>Asignar Programación</h3>
            {success && <Alert severity="success">Programación asignada correctamente.</Alert>}
            {error && <Alert severity="error">Error al asignar programación.</Alert>}
            <FormControl style={{ width: '50%', margin: 'normal' }}>
                <InputLabel>Selecciona una Programación</InputLabel>
                <Select
                    value={selectedProgramacion}
                    onChange={handleProgramacionChange}
                    required
                >
                    {availableProgramaciones.map((programacion) => (
                        <MenuItem key={programacion.id} value={programacion.id}>
                            {programacion.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    
            <div style={{ marginTop: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAssignProgramacion}
                    disabled={!selectedProgramacion || availableProgramaciones.length === 0}
                >
                    Asignar Programación
                </Button>
            </div>
        </div>
    );    
};

export default AsignarProgramacion;
