import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Importa solo el miembro necesario
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'; // Simplifica la importación
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export default function MyDataField(props) {
    const { label, control, width, name } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={name}
                control={control}
                render={({ 
                    field: { onChange, value },
                }) => (
                        
                    <DatePicker
                        label={label} 
                        sx={{width:{width}}}
                        onChange={onChange}
                        value={value}
                        
                    />
                )}
            />
        </LocalizationProvider>
    );
}
