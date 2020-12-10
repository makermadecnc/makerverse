import React from 'react';
import clsx from 'clsx';
import ListMenu from './ListMenu';
import { Drawer } from '@material-ui/core';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';

interface OwnProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

type Props = OwnProps;

const SideDrawer: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(SideDrawer);
  const classes = useStyles();
  const isOpen = props.isOpen;
  log.verbose('menus');

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
    <nav className={classes.drawer} aria-label='main menu'>
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
