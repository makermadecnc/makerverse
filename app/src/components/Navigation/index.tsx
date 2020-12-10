import React, { FunctionComponent } from 'react';
import HeaderBar from './HeaderBar';
import SideDrawer from './SideDrawer';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {IMaybeHaveWorkspace} from '../Workspaces';
export { default as ProtectedRoute } from './ProtectedRoute';
export { default as NotFound } from './NotFound';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps & IMaybeHaveWorkspace;

const Navigation: FunctionComponent<Props> = (props) => {
  const log = useLogger(Navigation);
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  log.verbose('menus');

  return (
    <div className={classes.root}>
      <HeaderBar workspace={props.workspace} toggleDrawerOpen={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer isOpen={drawerOpen} setOpen={setDrawerOpen} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Navigation;
