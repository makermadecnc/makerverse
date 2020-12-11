import { Paper, Grid, Typography, CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { IHaveToolGroup } from '../../components/Tools';
import useStyles from './Styles';
import {useMakerverseTrans} from '../../providers';
import ToolLoader from '../../components/Tools/ToolLoader';
import {IHaveWorkspace} from '../../components/Workspaces';

type Props = IHaveToolGroup & IHaveWorkspace;

const ToolPane: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const t = useMakerverseTrans();
  const { toolGroup, workspace } = props;
  const { titleKey, tools } = toolGroup;

  return (
    <Paper className={classes.toolPaper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary">
            {t(titleKey)}
          </Typography>
          <React.Suspense fallback={<CircularProgress />}>
            {tools.map((t) => {
              return <ToolLoader key={t.id} tool={t} workspace={workspace} />;
            })}
          </React.Suspense>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ToolPane;
