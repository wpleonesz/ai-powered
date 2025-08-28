import React from 'react';
import {
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';

const ToolTipContext = React.createContext();

const useStyles = makeStyles((theme) => ({
  listWrap: {
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      borderRadius: `2px`,
      background: `rgba(57,57,251,.05)`,
      borderRight: `3px solid ${theme.palette.primary.main}`,
      '& $listIcon': {
        color: theme.palette.primary.main,
        backgroundColor: `white`,
      },
      '& $listText': {
        fontWeight: `520`,
        color: theme.palette.primary.main,
      },
    },
  },
  listNotWrap: {
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      borderRadius: `2px`,
      background: `rgba(57,57,251,.05)`,
      boxShadow: `-1px 1px 2px #b8b8b8,
      1px -1px 2px #ffffff`,
      borderRight: `2px solid ${theme.palette.primary.main}`,
      '& $listIcon': {
        color: theme.palette.primary.main,
        backgroundColor: `white`,
      },
      '& $listText': {
        fontWeight: `520`,
        color: theme.palette.primary.main,
      },
    },
  },
  listText: { fontSize: `14px` },
  listIcon: {
    fontSize: '19px',
    color: theme.palette.primary.main,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    boxShadow: theme.shadows[1],
    fontSize: 11,
    fontWeight: 600,
  },
  arrow: {
    color: theme.palette.common.white,
  },
}));

const SidebarListIteam = ({ icon, text, dir, urls, handleOpen }) => {
  const classes = useStyles();
  const router = useRouter();
  const link = `${dir}`.concat('/').concat(urls);

  const onClick = async () => {
    await router.push(link);
    if (isMobile) handleOpen();
  };

  return (
    <ToolTipContext.Consumer>
      {(value) => {
        return (
          <a onClick={onClick}>
            <Tooltip
              title={value ? text : `${text}`}
              placement="right"
              classes={{ tooltip: classes.tooltip }}
            >
              <ListItem button className={classes.listWrap}>
                <ListItemIcon>
                  <Icon className={classes.listIcon}>{icon}</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography className={classes.listText}>{text}</Typography>
                  }
                />
              </ListItem>
            </Tooltip>
          </a>
        );
      }}
    </ToolTipContext.Consumer>
  );
};

SidebarListIteam.prototype = {};

export default SidebarListIteam;
