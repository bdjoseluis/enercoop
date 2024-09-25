import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import { Box, Typography } from '@mui/material';
import Protocolo from './forms/Protocolo';
import MyTextField from './forms/MyTextField';
import { useForm } from 'react-hook-form';
import AxiosInstance from './Axios';
import MyIpField from './forms/MyIpField';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { handleSubmit, control, setValue } = useForm();

    useEffect(() => {
        AxiosInstance.get(`contador/${id}/`)
            .then(response => {
                const { ip, protocolo, puerto, direccion_enlace, punto_medida, clave_lectura, num_serie } = response.data;

                const ipArray = ip.split('.').map(Number);

                console.log("IP:", ipArray);
                setValue('ipAddress', ipArray); 
                setValue('protocolo', protocolo);
                setValue('puerto', puerto);
                setValue('direccion_enlace', direccion_enlace);
                setValue('punto_medida', punto_medida);
                setValue('clave_lectura', clave_lectura);
                setValue('num_serie', num_serie); // Agregar num_serie
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los datos del contador:', error);
                setLoading(false);
            });
    }, [id, setValue]);

    const onSubmit = (data) => {
        // Convertir el array de dirección IP a una cadena
        const ipAddress = data.ipAddress.join('.');
        // Crear un nuevo objeto con la dirección IP actualizada
        const updatedData = { ...data, ip: ipAddress };
    
        AxiosInstance.put(`contador/${id}/`, updatedData)
            .then(response => {
                navigate('/');
                console.log('Contador actualizado:', response.data);
            })
            .catch(error => {
                console.error('Error al actualizar el contador:', error);
            });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{display:'flex', width:'100%', backgroundColor:'#00003f', marginBottom:'10px'}}>
                    <Typography sx={{marginLeft:'20px', color:'#fff'}}>
                        Editar Contador
                    </Typography>
                </Box>
                <Box sx={{display:'flex', width:'100%', boxShadow:3, padding:4, flexDirection:'column'}}>
                    <Box> 
                        <MyIpField
                            label="IP"
                            name="ip"
                            control={control}
                            placeholder="Asigna una IP"
                        />
                    </Box>
                </Box>
                <Box>
                    <Box sx={{display:'flex', width:'100%', boxShadow:3, padding:4, flexDirection:'column'}}> 
                        <FormHelperText sx={{ textAlign: 'center' }}>
                            Elige un Protocolo
                        </FormHelperText>
                        <Protocolo
                            label="Protocolo"
                            name="protocolo"
                            control={control}
                            placeholder="Asigna un protocolo"
                        />
                    </Box>  
                </Box>
                <Box sx={{display:'flex', width:'100%', boxShadow:3, padding:4, flexDirection:'column'}}>
                    <Box> 
                        <MyTextField
                            label="Puerto"
                            name="puerto"
                            control={control}
                            placeholder="Asigna un Puerto"
                        />
                    </Box>   
                </Box>

                <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
                    <Box>
                        <MyTextField
                            label="Dirección de Enlace"
                            name="direccion_enlace"
                            control={control}
                            placeholder="Asigna una dirección de enlace"
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
                    <Box>
                        <MyTextField
                            label="Punto de Medida"
                            name="punto_medida"
                            control={control}
                            placeholder="Asigna un punto de medida"
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
                    <Box>
                        <MyTextField
                            label="Clave de Lectura"
                            name="clave_lectura"
                            control={control}
                            placeholder="Asigna una clave de lectura"
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex'}}>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit" sx={{width:'100%'}}
                    >
                        Guardar Cambios
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default Edit;
