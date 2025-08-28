import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import { default as UISwitch } from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
  },
}));

const Switch = ({
  id,
  control,
  label,
  color = 'primary',
  justifyContent = 'flex-start',
  checked,
  onBlur,
  onChange,
}) => {
  const classes = useStyles();
  const [state, setState] = useState(checked);

  return (
    <Grid
      item
      container
      alignItems="center"
      className={classes.container}
      justifyContent={justifyContent}
    >
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <FormGroup row>
            <FormControlLabel
              label={label}
              control={
                <UISwitch
                  id={id}
                  name={field.name}
                  ref={field.ref}
                  color={color}
                  checked={state}
                  onChange={(event) => {
                    if (onChange) onChange(event);
                    setState(event.target.checked);
                    field.onChange(event);
                  }}
                  onBlur={(event) => {
                    if (onBlur) onBlur(event);
                    field.onBlur(event);
                  }}
                />
              }
            />
          </FormGroup>
        )}
      />
    </Grid>
  );
};

export default Switch;
