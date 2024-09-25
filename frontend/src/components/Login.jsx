import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí puedes agregar la lógica de autenticación, como enviar una solicitud al servidor
    // para verificar las credenciales del usuario.

    // Por ahora, simplemente puedes dejar esta función vacía o agregar lógica adicional si es necesario.
  };

  const handleGoBack = () => {
    // Redirige al usuario a la página anterior utilizando window.history.back()
    window.history.back();
  };

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
      <Typography variant="h4" gutterBottom>
        Iniciar sesión
      </Typography>
      <Box sx={{ width: 300, marginBottom: 2 }}>
        <TextField
          label="Nombre de usuario"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginBottom: 1 }}>
        Iniciar sesión
      </Button>
      <Button variant="contained" color="secondary" onClick={handleGoBack}>
        Volver atrás
      </Button>
    </Box>
  );
};

export default Login;
