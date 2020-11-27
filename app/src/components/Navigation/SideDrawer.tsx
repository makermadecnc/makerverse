import React from 'react';
import clsx from 'clsx';
import ListMenu from './ListMenu';
import { Drawer } from '@material-ui/core';
import useStyles from './Styles';

interface OwnProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

type Props = OwnProps;

const SideDrawer: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const isOpen = props.isOpen;

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
          [classes.drawerOpen]: isOpen,
          [classes.drawerClose]: !isOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: isOpen,
            [classes.drawerClose]: !isOpen,
          }),
        }}
      >
        <ListMenu isOpen={isOpen} />
      </Drawer>
    </nav>
  );
};

export default SideDrawer;
