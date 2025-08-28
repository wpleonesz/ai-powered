import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { default as UICard } from '@material-ui/core/Card';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  rootActive: {
    maxWidth: 'auto',
    borderLeft: '8px solid #BDCA32',
    margin: 2,
    height: '98%',
  },
  rootDesactive: {
    maxWidth: 'auto',
    borderLeft: '8px solid #5BA3A1',
    margin: 2,
    height: '95%',
  },
  cardIcon: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  colorIconActive: {
    backgroundColor: '#FFF',
    borderColor: '#BDCA32',
    height: 50,
    width: 50,
    fontSize: '40px',
    fontWeight: 'bold',
  },
  colorIconDesactive: {
    backgroundColor: '#FFF',
    borderColor: '#5BA3A1',
    height: 50,
    width: 50,
    fontSize: '40px',
    fontWeight: 'bold',
  },
  container: {
    height: '100%',
    backgroundColor: '#3743',
  },
  childrenContainer: {},
  childrenItems: {
    marginRight: 5,
  },
}));

const Card = ({
  children,
  title,
  description,
  active,
  icon,
  url,
  pusheable,
}) => {
  const router = useRouter();
  const classes = useStyles();

  const push = async () => (pusheable ? await router.push(url) : undefined);
  const leftSize = () => (children ? 9 : 12);
  const rightSize = () => (children ? 3 : 12);

  return (
    <UICard
      className={active ? classes.rootActive : classes.rootDesactive}
      onClick={push}
    >
      <Grid container>
        <Grid item container xs={leftSize()}>
          <CardHeader
            avatar={
              icon ? (
                <Avatar
                  className={
                    active
                      ? classes.colorIconActive
                      : classes.colorIconDesactive
                  }
                  variant="rounded"
                  aria-label="recipe"
                >
                  <Image
                    className={classes.cardIcon}
                    width={100}
                    height={100}
                    src={icon}
                    alt="icono"
                  />
                </Avatar>
              ) : (
                ''
              )
            }
            title={
              <Typography variant="button">
                <strong>{title}</strong>
              </Typography>
            }
            subheader={
              description && (
                <Typography variant="subtitle2">{description}</Typography>
              )
            }
          />
        </Grid>
        {children ? (
          <Grid
            item
            container
            xs={rightSize()}
            justifyContent="flex-end"
            alignContent="center"
            className={classes.childrenContainer}
          >
            <Grid item className={classes.childrenItems}>
              {children}
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </UICard>
  );
};

export default Card;
