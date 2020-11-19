import { useLogger } from '@openworkshop/lib/utils/logging/UseLogger';
import React from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../lib/analytics';
import Workspaces from '../lib/workspaces';
import settings from '../config/settings';
import { Typography } from '@material-ui/core';
import Navigation from 'components/Navigation';

export default function App() {
  const log = useLogger(App);
  const location = useLocation();
  const workspace = Workspaces.findByPath(location.pathname);

  React.useEffect(() => {
    log.trace('app workspace', workspace, 'location', location);

    if (workspace) {
      document.title = `${workspace.name} | ${settings.productName}`;
    } else {
      document.title = settings.productName;
    }

    analytics.trackPage(location, workspace);
  }, [analytics, log, workspace]);

  return (
    <Navigation>
      <Typography paragraph>aoeu</Typography>
    </Navigation>
  );

  // return (
  //   <div>
  //     <Header {...this.props} />
  //     <aside className={styles.sidebar} id='sidebar'>
  //       <Sidebar {...this.props} />
  //     </aside>
  //     <div className={styles.main}>
  //       <div className={styles.content}>
  //         <Home
  //           {...this.props}
  //           isActive={location.pathname === '/home'}
  //           style={{
  //             display: location.pathname !== '/home' ? 'none' : 'block',
  //           }}
  //         />
  //         {Object.keys(Workspaces.all).map((workspaceId) => {
  //           const workspace = Workspaces.all[workspaceId];
  //           workspace.isActive = location.pathname === workspace.path;
  //           return (
  //             <Workspace
  //               {...this.props}
  //               key={workspaceId}
  //               workspaceId={workspaceId}
  //               style={{
  //                 display: workspace.isActive ? 'block' : 'none',
  //               }}
  //             />
  //           );
  //         })}
  //         {location.pathname.indexOf('/settings') === 0 && <Settings {...this.props} />}
  //       </div>
  //     </div>
  //   </div>
  // );
}
