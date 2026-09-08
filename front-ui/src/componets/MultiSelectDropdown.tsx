import React, { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';

interface MultiSelectDropdownProps {
  label: string;
  list: string[];
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, list }) => {
 
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        multiple
        size="small"
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
      >
        {list.map((item) => (
          <MenuItem key={item} value={item}>
            <Checkbox checked={selectedValues.indexOf(item) > -1} />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectDropdown;