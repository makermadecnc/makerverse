import React, { FunctionComponent } from 'react';
import HeaderBar from './HeaderBar';
import SideDrawer from './SideDrawer';
import useStyles from './Styles';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const Menus: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <HeaderBar toggleDrawerOpen={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Menus;
