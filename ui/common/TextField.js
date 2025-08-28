import React, { useState } from 'react';
import {
  TextField as UITextField,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Controller } from 'react-hook-form';

const TextField = ({
  disabled = false,
  value,
  id,
  label,
  control,
  type,
  multiline,
  rows,
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  margin = 'dense',
  onBlur,
  onChange,
  onInput,
  inputProps = {},
  errors,
  shrink,
  uppercase = false,
  readOnly = false,
  onFocus, // Agregamos onFocus como una prop opcional
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={id}
      control={control}
      render={({ field }) => (
        <UITextField
          id={id}
          value={field.value ?? value ?? ''}
          name={field.name}
          ref={field.ref}
          onChange={(event) => {
            if (onChange) onChange(event);
            field.onChange(event);
          }}
          onBlur={(event) => {
            if (onBlur) onBlur(event);
            field.onBlur(event);
          }}
          onFocus={(event) => {
            if (onFocus) onFocus(event); // Ejecutar onFocus solo si se pasa
          }}
          onInput={(event) => {
            if (onInput) onInput(event);
          }}
          InputLabelProps={{
            shrink: shrink,
          }}
          inputProps={{
            readOnly: readOnly,
            style: { textTransform: uppercase ? 'uppercase' : 'none' },
            ...inputProps,
          }}
          disabled={disabled}
          multiline={multiline}
          minRows={rows}
          label={label}
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          variant={variant}
          fullWidth={fullWidth}
          size={size}
          margin={margin}
          helperText={errors?.message}
          error={!!errors}
          required={required}
          InputProps={{
            endAdornment:
              type === 'password' ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ) : null,
          }}
        />
      )}
    />
  );
};

export default TextField;
