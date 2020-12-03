import React, { FunctionComponent } from 'react';
import HeaderBar from './HeaderBar';
import SideDrawer from './SideDrawer';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
export { default as ProtectedRoute } from './ProtectedRoute';
export { default as NotFound } from './NotFound';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const Menus: FunctionComponent<Props> = (props) => {
  const log = useLogger(Menus);
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  log.verbose('menus');

  return (
    <div className={classes.root}>
      <HeaderBar toggleDrawerOpen={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer isOpen={drawerOpen} setOpen={setDrawerOpen} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Menus;
