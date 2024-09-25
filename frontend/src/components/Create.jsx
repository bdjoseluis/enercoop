import React from 'react';
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import { Box, Typography } from '@mui/material'
import MyIpField from './forms/MyIpField'
import Protocolo from './forms/Protocolo'
import MyTextField from './forms/MyTextField';
import { useForm } from 'react-hook-form';
import AxiosInstance from './Axios';
import {useNavigate} from 'react-router-dom'


const Create = () => {

    const navigate = useNavigate()
    const defaultValues = {
        ip : '',
        protocolo: '',
        puerto: '',
        direccion_enlace: '',
        punto_medida:  '',
        clave_lectura:  '',
        num_serie: ''
    }
    const {handleSubmit, control} = useForm({defaultValues})
    const submission = (data) => {
        const ipAddress = data.ipAddress.join('.');

        AxiosInstance.post(`contador/`,{
            ip: ipAddress,
            num_serie: data.num_serie,
            protocolo: data.protocolo,
            puerto: data.puerto,
            direccion_enlace: data.direccion_enlace,
            punto_medida: data.punto_medida,
            clave_lectura: data.clave_lectura
        })
        .then(response => {
            navigate('/')
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error al enviar los datos al backend:', error);
        });
    }

    return (
        <div>
            <form onSubmit = {handleSubmit(submission)}>

            <Box sx={{display:'flex', width:'100%', backgroundColor:'#00003f', marginBottom:'10px'}}>
                <Typography sx={{marginLeft:'20px', color:'#fff'}}>
                    Crear Contador
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

            <Box sx={{ display: 'flex', width: '100%', boxShadow: 3, padding: 4, flexDirection: 'column' }}>
                    <Box>
                        <MyTextField
                            label="Número de Serie" // Nuevo campo num_serie
                            name="num_serie" // Nuevo campo num_serie
                            control={control}
                            placeholder="Asigna un número de serie" // Nuevo campo num_serie
                        />
                    </Box>
                </Box>
                
            <Box>
                <Box sx={{display:'flex', width:'100%', boxShadow:3, padding:4, flexDirection:'column'}}> 
                         <FormHelperText>
                            <div align='center'>
                                Elige un Protocolo
                            </div>
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


            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    type="submit" sx={{width:'100%'}}
                >
                    Crear un Contador
                </Button>
            </Box>
            </form>
            
        </div>
    )
    
}

export default Create
