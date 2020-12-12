import { Box } from '@material-ui/core';
import * as React from 'react';
import useStyles from './Styles';
import {barSize} from '../../views/Workspace/Styles';

type Props = {
  children: React.ReactNode;
  // subtractHeight?: number;
  className?: string;
};

const GcodeVisualizer: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { children, className } = props;

  return (
    <Box className={className} >
      {children}
    </Box>
  );
};

export default GcodeVisualizer;
