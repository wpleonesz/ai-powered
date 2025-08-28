import ListSubheader from '@mui/material/ListSubheader';
import SidebarListItem from '@ui/layout/SidebarListItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import { useEffect, useState } from 'react';
import { menuService } from '@services/menu.service';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  transparent: {
    background: 'transparent',
  },
  multilevel: {
    paddingLeft: theme.spacing(3),
  },
}));

const upper = (text) => {
  return upper ? text.toUpperCase() : text;
};
const hasChildren = (item) => {
  if (item?.dashboard) return false;
  const { children: children } = item;
  if (children === undefined) {
    return false;
  }
  if (children.constructor !== Array) {
    return false;
  }
  if (children.length === 0) {
    return false;
  }
  return true;
};
const MenuItem = ({ item, handleOpen }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} handleOpen={handleOpen} />;
};

const SingleLevel = ({ item, handleOpen }) => {
  if (!item?.Page && !item?.dashboard) return <></>;
  return (
    <SidebarListItem
      key={item.id}
      text={item.displayName || item.name}
      icon={item.icon}
      dir={item.Page?.url}
      handleOpen={handleOpen}
      urls=""
    />
  );
};

const MultiLevel = ({ item, handleOpen }) => {
  const { children: children } = item;
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListSubheader
          key={item.id}
          className={classes.transparent}
          component="div"
          id="nested-list-subheader"
        >
          {upper(item.name)}
        </ListSubheader>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className={classes.multilevel}>
          {children.map((child, key) => (
            <MenuItem key={key} item={child} handleOpen={handleOpen} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SidebarList = ({ handleOpen }) => {
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      const tree = await menuService.getTree();
      setMenus(tree);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <Alert severity="error">
        <div>Error al cargar los menus</div>
        <div>{error}</div>
      </Alert>
    );
  }
  return menus.map((item, key) => (
    <MenuItem key={key} item={item} handleOpen={handleOpen} />
  ));
};

export default SidebarList;
