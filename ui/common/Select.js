/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ReplayIcon from '@material-ui/icons/Replay';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { isEmpty } from 'lodash';
import { Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& > * + *': {
      marginTop: theme.spacing(3),
      minWidth: 100,
    },
  },
  label: {
    color: '#393838',
    fontWeight: 'bold',
  },
}));

const parseError = (label, error) => {
  const message = error.message || error.name || JSON.stringify(error);
  return `Ocurrio un error al cargar el campo ${label}: ${message}`;
};

const Select = ({
  id,
  where = {},
  records,
  label,
  displayLabel,
  labelHandler,
  margin = 'dense',
  size = 'small',
  variant = 'outlined',
  fullWidth = true,
  disabled = false,
  errors,
  control,
  service,
  dataHandler,
  filterBy,
  multiple = false,
  exclude,
  reload = true,
  url,
  onChange,
  onBlur,
  getter,
  reloadFlag = 0,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [mouseOver, setMouseOver] = useState(false);
  const [focused, setFocused] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // Asegurarnos de que control._formValues existe antes de intentar acceder a una propiedad
  const selected =
    control && control._formValues ? control._formValues[id] : null;

  const filterData = useCallback(
    (data) => {
      return data
        .filter((item) => {
          if (item.id === selected) return true;
          if (exclude && item.id === exclude) return;
          if (item.hasOwnProperty('active') && !item.active) return;
          if (filterBy) return filterBy(item);
          return true;
        })
        .sort((a, b) => {
          // Define the order of the special words
          const specialWordsOrder = [
            'NINGUNA',
            'NINGUNO',
            'NO APLICA',
            'NO REGISTRA',
          ];
          const aName = defineName(a).toUpperCase();
          const bName = defineName(b).toUpperCase();
          if (
            specialWordsOrder.includes(aName) &&
            specialWordsOrder.includes(bName)
          ) {
            return (
              specialWordsOrder.indexOf(aName) -
              specialWordsOrder.indexOf(bName)
            );
          }
          if (specialWordsOrder.includes(aName)) return 1;
          if (specialWordsOrder.includes(bName)) return -1;
          return 0;
        });
    },
    [exclude, filterBy, selected],
  );

  const getData = useCallback(async () => {
    if (!isEmpty(records)) return records;
    if (dataHandler) return await dataHandler();
    if (service) {
      return await service.getAll({ active: [true, false], filter: where });
    }
    return [];
  }, [dataHandler, records, service]);

  const load = useCallback(async () => {
    setLoading(true);
    setSuccess(true);
    try {
      const data = await getData();
      setData(filterData(data));
    } catch (error) {
      snackbar.error(enqueueSnackbar, parseError(label, error));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filterData, getData, label, reloadFlag]);

  useEffect(() => {
    load();
  }, [records, load]);

  useEffect(() => {
    if (multiple) setValue(data.filter((item) => selected.includes(item.id)));
    else setValue(data.find((item) => item.id === selected));
  }, [data, selected, multiple]);

  const helperText = () => errors?.message;
  const textFieldError = () => !!errors || !success;

  const onChangeAutocomplete = (newValue, field) => {
    setValue(newValue);
    if (multiple) field.onChange(newValue.map((item) => item.id));
    else field.onChange(newValue?.id);
    if (onChange) onChange(newValue);
    if (getter) getter(newValue);
  };

  const onBlurAutocomplete = (event) => {
    if (onBlur) onBlur(event);
  };

  const renderTags = (tagValue, getTagProps) => {
    if (!multiple) return tagValue;
    return tagValue.map((option, index) => (
      <Chip
        key={option?.id}
        label={
          url ? (
            <Link
              href={`${url}/${option.id}`}
              target="_blank"
              variant="body2"
              className={classes.label}
            >
              {defineName(option)}
            </Link>
          ) : (
            <div className={classes.label}>{defineName(option)}</div>
          )
        }
        {...getTagProps({ index })}
      />
    ));
  };

  const defineName = (option) => {
    const _default = () => option.name || '';
    if (displayLabel) return option[displayLabel] || _default();
    if (labelHandler) return labelHandler(option);
    return _default();
  };

  return (
    <div className={classes.formControl}>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple={multiple}
            value={value || null}
            onChange={(_, newValue) => onChangeAutocomplete(newValue, field)}
            onMouseOver={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              setFocused(false);
              onBlurAutocomplete(event);
            }}
            options={data}
            disabled={disabled || loading || !success}
            getOptionSelected={(option, value) => option.id === value?.id}
            getOptionLabel={(option) => defineName(option)}
            loading={loading}
            renderTags={(tagValue, getTagProps) =>
              renderTags(tagValue, getTagProps)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                size={size}
                margin={margin}
                variant={variant}
                fullWidth={fullWidth}
                helperText={helperText()}
                error={textFieldError()}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <Grid
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginLeft: 'calc(100% - 95px)',
                          width: 28,
                          position: 'absolute',
                        }}
                      >
                        <Grid item>
                          {loading && (
                            <CircularProgress color="inherit" size={15} />
                          )}
                          {reload && (mouseOver || focused) && (
                            <IconButton size="small" onClick={() => load()}>
                              <ReplayIcon style={{ width: 20 }} />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}
      />
    </div>
  );
};

export default Select;
