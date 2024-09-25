import * as React from 'react';
import Box from '@mui/material/Box';
import { Controller } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';


export default function Protocolo(props) {
  const { name, control } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box display="flex" justifyContent="center">
        <RadioGroup
          row
          value={field.value || ''}
          onChange={(e) => field.onChange(e.target.value)}
        >
          <FormControlLabel
            value="EIC102"
            control={<Radio color="primary" />}
            label="EIC102"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="EIC104"
            control={<Radio color="secondary" />}
            label="EIC104"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="Modbus"
            control={<Radio color="success" />}
            label="Modbus"
            labelPlacement="bottom"
          />
        </RadioGroup>
        </Box>
      )}
    />
  );
}