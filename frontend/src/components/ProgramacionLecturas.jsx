import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios';
import { useForm } from 'react-hook-form';
import { Button, Box, Typography, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextoField from './forms/TextoField';
import MyTextField from './forms/MyTextField';
import MyDataField from './forms/MyDataField';
import dayjs from 'dayjs';
import Automatico from './forms/Automatico';


const ProgramacionLecturas = () => {

  const navigate = useNavigate();
  const defaultValues = {
    nombre: '',
    fecha_inicio: null,
    fecha_fin: null,
    periodo: '',
    accion: 'Telegram_Test',
    dispositivos: '',
    automatico: 'false',
  };
  const { handleSubmit, control } = useForm({ defaultValues });
  const [error, setError] = useState(null); // Definir el estado de error
  const [intervalId, setIntervalId] = useState(null);

  const submission = (data) => {

    const FechaInicio = dayjs(data.fecha_inicio["$d"]).format("YYYY-MM-DD");
    const FechaFin = dayjs(data.fecha_fin["$d"]).format("YYYY-MM-DD");

    
    AxiosInstance.post(`programacion/`, {
        nombre: data.nombre,
        fecha_inicio: FechaInicio,
        fecha_fin: FechaFin,
        periodo: data.periodo,
        accion: data.accion,
        automatico: data.automatico, 
      })
      .then((response) => {
       // Iniciar el temporizador cuando la programación se haya creado exitosamente
      const id = setInterval(() => {
        console.log('Script ejecutado con éxito:', response.data);
        
      }, data.periodo * 1000 * 60); // Convertir el periodo de minutos a milisegundos

      setIntervalId(id);
      navigate('/');
      console.log(response.data);
      })
      .catch((error) => {
        console.error('Error al enviar los datos al backend:', error);
        setError('Error al enviar los datos al backend. Por favor, inténtalo de nuevo.');
      });
  };

  useEffect(() => {
    return () => {
      // Limpiar el temporizador cuando el componente se desmonte
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  return (
    <div>
      <form onSubmit={handleSubmit(submission)}>
        <Box sx={{ display: 'flex', width: '100%', backgroundColor: '#00003f', marginBottom: '10px' }}>
          <Typography sx={{ marginLeft: '20px', color: '#fff' }}>
            Crear Programación de Lecturas
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
            <TextoField
              label="Nombre"
              name="nombre"
              control={control}
              placeholder="Asigna un nombre"
            />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
            <MyDataField
              label="Fecha de Inicio"
              name="fecha_inicio"
              control={control}
              width={'30%'}
            />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
            <MyDataField
              label="Fecha de Fin"
              name="fecha_fin"
              control={control}
              width={'30%'}
            />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
            <MyTextField
              label="Periodo"
              name="periodo"
              control={control}
              placeholder="Asigna un periodo"
            />
          </Box>
          <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
            <TextoField
              label="Accion"
              name="accion"
              control={control}
              placeholder="Asigna una accion"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
            <FormHelperText>
                <div align='center'>
                    Modo Automatico o instataneo
                </div>
            </FormHelperText>
            <Automatico
              label="Automático"
              name="automatico"
              control={control}
              placeholder="true o false"
            />
          </Box>
        <Box>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{ width: '100%' }}
          >
            Crear Programación
          </Button>
        </Box>
      </form>
      {error && <div>{error}</div>} {/* Muestra el mensaje de error si está definido */}
    </div>
  );
};

export default ProgramacionLecturas;
