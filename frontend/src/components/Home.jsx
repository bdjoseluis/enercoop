import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Bienvenido a Enercoop
      </Typography>
      <Typography variant="body1" paragraph>
        Somos expertos en la gestión de contadores, contratos y plantas solares.
      </Typography>
      <Typography variant="body1" paragraph>
        Nuestra plataforma te ofrece todas las herramientas que necesitas para una gestión eficiente y efectiva.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login">
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default Home;
