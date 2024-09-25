import * as React from 'react';
import Box from '@mui/material/Box';
import { Controller } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export default function Automatico(props) {
  const { name, control } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box display="flex" justifyContent="center">
          <RadioGroup
            row
            value={field.value === true ? 'true' : 'false'}
            onChange={(e) => field.onChange(e.target.value === 'true')}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Sí"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </Box>
      )}
    />
  );
}
