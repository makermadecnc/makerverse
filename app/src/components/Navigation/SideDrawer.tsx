import React from 'react';
import clsx from 'clsx';
import ListMenu from './ListMenu';
import { Drawer } from '@material-ui/core';
import useStyles from './Styles';

interface OwnProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type Props = OwnProps;

const SideDrawer: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const open = props.open;

  //
  // const toggleDrawer = (open: boolean) => (
  //   event: React.KeyboardEvent | React.MouseEvent,
  // ) => {
  //   if (
  //     event &&
  //     event.type === 'keydown' &&
  //     ((event as React.KeyboardEvent).key === 'Tab' ||
  //       (event as React.KeyboardEvent).key === 'Shift')
  //   ) {
  //     return;
  //   }
  //
  //   props.setOpen(open);
  // };

  return (
    <nav className={classes.drawer} aria-label='workspaces'>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <ListMenu isPermanent={false} />
      </Drawer>
    </nav>
  );
};

export default SideDrawer;
