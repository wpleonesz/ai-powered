import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Spinner from '@ui/common/Spinner';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { personService } from '@services/person.service';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    padding: 0,
  },
  panel: {
    margin: 0,
    position: 'relative',
  },
  preview: {
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    borderRadius: '50%',
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
    },
    objectFit: 'cover',
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '50%',
    width: 75,
    height: 75,
    margin: '0 auto',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%',
    display: 'flex',
  },
  actions: {
    justifyContent: 'center',
    marginTop: 2,
  },
  button: {
    borderRadius: 12,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    fontWeight: 400,
    padding: '1px 6px',
    fontSize: '0.65rem',
    minHeight: '20px',
    textTransform: 'none',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.4)',
    color: 'white',
    fontSize: '0.65rem',
    padding: '2px 0',
    textAlign: 'center',
    borderBottomLeftRadius: '50%',
    borderBottomRightRadius: '50%',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 1,
    },
  },
  paper: {
    borderColor: 'white',
  },
  paperError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
  },
}));

const PLACEHOLDER = `/assets/images/profile.png`;

const ProfilePhoto = ({ person }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [record] = useState(person);
  const [preview, setPreview] = useState(person?.photo || PLACEHOLDER);
  const { enqueueSnackbar } = useSnackbar();

  const toBase64 = async (image) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const checkSize = (size) => {
    if (size > 2000000)
      return snackbar.error(
        enqueueSnackbar,
        'La imagen no puede pesar más de 2 MB',
      );
    return true;
  };

  const parsePhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return null;

    if (!checkSize(file.size)) return null;
    return await toBase64(file);
  };

  const onChangeImage = async (event) => {
    if (!person) {
      snackbar.error(
        enqueueSnackbar,
        'No fue posible identificar su registro personal',
      );
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const photo = await parsePhoto(event);
      if (!photo) {
        setLoading(false);
        return;
      }

      const result = await personService.updatePhoto(record.id, photo);
      setPreview(result.photo || PLACEHOLDER);
      snackbar.success(enqueueSnackbar, 'Foto actualizada correctamente');
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid className={classes.container}>
      <Grid container className={classes.panel}>
        <Grid item container className={classes.preview}>
          <div className={classes.imageWrapper}>
            <Image
              src={preview}
              width={75}
              height={75}
              alt="profile"
              className={classes.image}
              priority
              objectFit="cover"
            />
            {loading && (
              <div className={classes.loading}>
                <Spinner size={30} thickness={3} />
              </div>
            )}
            <input
              accept="image/jpeg, image/jpg"
              style={{ display: 'none' }}
              id="photo"
              type="file"
              onChange={(event) => {
                onChangeImage(event);
              }}
            />
            <label htmlFor="photo" className={classes.uploadOverlay}>
              Cambiar
            </label>
          </div>
        </Grid>
        <Grid item container className={classes.actions}>
          <label htmlFor="photo">
            <Button
              color="primary"
              size="small"
              variant="contained"
              component="span"
              className={classes.button}
            >
              Editar
            </Button>
          </label>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePhoto;
