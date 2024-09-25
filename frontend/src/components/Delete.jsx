import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';
import Protocolo from './forms/Protocolo';
import MyTextField from './forms/MyTextField';
import AxiosInstance from './Axios';
import MyIpField from './forms/MyIpField';
import { useNavigate, useParams } from 'react-router-dom';

const Delete = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [contador, setContador] = useState(null);

    useEffect(() => {
        AxiosInstance.get(`contador/${id}/`)
            .then(response => {
                const { ip, protocolo, puerto, direccion_enlace, punto_medida, clave_lectura } = response.data;
                setContador({ ip, protocolo, puerto,  direccion_enlace, punto_medida, clave_lectura });
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los datos del contador:', error);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        AxiosInstance.delete(`contador/${id}/`)
            .then(response => {
                navigate('/');
                console.log('Contador eliminado:', response.data);
            })
            .catch(error => {
                console.error('Error al eliminar el contador:', error);
            });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <Typography variant="h5" gutterBottom>
                    Dirección IP: {contador.ip}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Protocolo: {contador.protocolo}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Puerto: {contador.puerto}
                </Typography>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleDelete}
                    sx={{marginTop:'20px'}}
                >
                    Borrar Contador
                </Button>
            </Box>
        </div>
    );
};

export default Delete;
