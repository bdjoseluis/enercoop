import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography'; // Importar Typography

export default function IPAddressInput(props) {
    const { control } = props;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} align="center">

                <Typography variant="subtitle1" gutterBottom>
                    Dirección IP
                </Typography>
            </Grid>
            {[0, 1, 2, 3].map((index) => (
                <Grid item xs={3} key={index}>
                    <Controller
                        name={`ipAddress[${index}]`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                type="number"
                                value={field.value}
                                inputProps={{
                                    min: 0,
                                    max: 255,
                                    style: { textAlign: "center" }
                                }}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
