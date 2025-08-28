import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import InstallButton from '@components/module/InstallButton';
import UpdateButton from '@ui/common/UpdateButton';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  rootActive: {
    maxWidth: 'auto',
    borderLeft: '10px solid #BDCA32',
    margin: 3,
  },
  rootDesactive: {
    maxWidth: 'auto',
    borderLeft: '10px solid #5BA3A1',
    margin: 3,
  },
  cardIcon: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  colorIconActive: {
    backgroundColor: '#FFF',
    borderColor: '#BDCA32',
    width: 70,
    height: 70,
    margin: 'auto 0',
    fontSize: '40px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
  },
  colorIconDesactive: {
    backgroundColor: '#FFF',
    borderColor: '#5BA3A1',
    width: 70,
    height: 70,
    margin: 'auto 0',
    fontSize: '40px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '60px',
    height: '60px',
  },
  subname: {
    marginBottom: 10,
  },
  actionButton: {
    margin: 1,
  },
}));

const ModuleCard = ({ url, module }) => {
  const router = useRouter();
  const classes = useStyles();

  // Usar una imagen de respaldo en caso de error
  const fallbackIcon = '/assets/images/module-default.png';

  const shouldPush = () => {
    return url && isMobile;
  };

  return (
    <Card
      className={module.active ? classes.rootActive : classes.rootDesactive}
      onClick={() => (shouldPush() ? router.push(url) : null)}
    >
      <CardHeader
        avatar={
          <Avatar
            className={
              module.active
                ? classes.colorIconActive
                : classes.colorIconDesactive
            }
            variant="rounded"
            aria-label="recipe"
          >
            <div className={classes.imageContainer}>
              <Image
                src={module.icon || fallbackIcon}
                fill
                sizes="60px"
                style={{ objectFit: 'contain' }}
                alt={`${module.name} icon`}
                quality={90}
              />
            </div>
          </Avatar>
        }
        title={
          <Typography variant="h6">
            <b>{module.name}</b>
          </Typography>
        }
        subheader={
          <>
            <div className={classes.subname}>{module.subname}</div>
            {!isMobile ? (
              <Grid
                item
                container
                justifyContent="flex-end"
                xs={12}
                spacing={1}
              >
                <div className={classes.actionButton}>
                  <UpdateButton url={url}>Detalles</UpdateButton>
                </div>

                {module.code !== 'base' ? (
                  <div className={classes.actionButton}>
                    <InstallButton module={module} />
                  </div>
                ) : (
                  <></>
                )}
              </Grid>
            ) : (
              <></>
            )}
          </>
        }
      />
    </Card>
  );
};

export default ModuleCard;
