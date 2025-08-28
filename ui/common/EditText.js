import React from 'react';
import { Controller } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 9,
  },
  label: {
    marginTop: -10,
    marginLeft: 10,
    fontSize: 12,
  },
  labelText: {
    color: '#616161',
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5,
  },
  labelTextError: {
    color: 'red',
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5,
  },
  panel: {
    marginTop: 3,
    marginBottom: 90,
  },
  actions: {
    justifyContent: 'center',
    marginTop: -20,
  },
  paperError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
}));

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [
      { align: '' },
      { align: 'center' },
      { align: 'right' },
      { align: 'justify' },
    ],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
  clipboard: {
    // Asegurarse de que se pegue texto sin formato
    matchVisual: false,
    // Evitar pegar imágenes como base64 codificado
    allowImage: false,
    // Pegar sin formato (para evitar imágenes de emoticonos)
    pasteWithoutFormatting: true,
  },
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'align',
];

const EditText = ({ id, label, onChange, control, errors }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.container}>
      <Grid container className={classes.panel}>
        <Controller
          name={id}
          control={control}
          render={({ field }) => (
            <ReactQuill
              style={{ width: '100%', height: '18.4vh' }}
              theme="snow"
              placeholder={label}
              value={field.value}
              onChange={(event) => {
                field.onChange(event);
                onChange?.(event);
              }}
              modules={modules}
              formats={formats}
            />
          )}
        />
      </Grid>
      <Grid className={classes.errorText}>{errors?.message}</Grid>
    </Grid>
  );
};

export default EditText;
