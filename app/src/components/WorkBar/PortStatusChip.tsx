import * as React from 'react';
import {IMaybeHavePortStatus} from '../Ports/types';
import {getPortIcon} from '../Ports/Ports';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import PopoverWorkBarChip from './PopoverWorkBarChip';
import HelpfulHeader from '@openworkshop/ui/components/Text/HelpfulHeader';
import {useMakerverseTrans} from '../../providers';
import { Grid, Typography } from '@material-ui/core';
import useStyles from './Styles';
import {ConnectedPortStatusFragment} from '../../api/graphql';
import PortSelect from '../Ports/PortSelect';

type Props = IMaybeHavePortStatus;

const PortStatusChip: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(PortStatusChip);
  const t = useMakerverseTrans();
  const classes = useStyles();
  const { port } = props;

  log.verbose(port);

  function changePort(portName: string) {
    log.warn('change port not implemented for', portName);
  }

  function renderConnection(conn: ConnectedPortStatusFragment) {
    return [
      <Grid item key="h-linesRead" xs={8} className={classes.popoverRowAlt} >
        <Typography variant="body1">{t('Lines Read')}</Typography>
      </Grid>,
      <Grid item key="linesRead" xs={4} className={classes.popoverRowAlt} style={{ textAlign: 'right' }} >
        <Typography variant="subtitle2">{conn.status.linesRead}</Typography>
      </Grid>,
      <Grid item key="h-linesWritten" xs={8} className={classes.popoverRow} >
        <Typography variant="body1">{t('Lines Written')}</Typography>
      </Grid>,
      <Grid item key="linesWritten" xs={4} className={classes.popoverRow} style={{ textAlign: 'right' }} >
        <Typography variant="subtitle2">{conn.status.linesWritten}</Typography>
      </Grid>,
    ];
  }

  return (
    <PopoverWorkBarChip faIcon={getPortIcon(port)} >
      <Grid item xs={12} className={classes.popoverRowAlt} >
        <HelpfulHeader
          variant="h6"
          tip={t('The physical connection to your machine (i.e., USB).')}
          title={t('Serial Port')}
        />
      </Grid>
      <Grid item xs={12} className={classes.popoverRow} >
        <PortSelect selectedPortName={port?.portName ?? ''} setSelectedPortName={changePort} />
      </Grid>
      {port?.connection && renderConnection(port.connection)}
    </PopoverWorkBarChip>
  );
};

export default PortStatusChip;
