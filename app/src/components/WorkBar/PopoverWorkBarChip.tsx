import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Chip, Grid } from '@material-ui/core';
import * as React from 'react';
import useStyles from './Styles';

type Props = {
  faIcon: IconDefinition;
  color?: 'primary' | 'secondary' | 'default';
  label?: React.ReactNode;
  children: React.ReactNode;
};

const PopoverWorkBarChip: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { faIcon, color, label, children } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const icon = (<FontAwesomeIcon className={classes.chipIcon} icon={faIcon} size="lg" />);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      <Chip
        className={classes.formControl}
        icon={label ? icon : undefined}
        label={label ? label : icon}
        clickable
        onClick={handleClick}
        color={color ?? 'primary'}
        variant="outlined"
      />
      <Popover
        className={classes.popover}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <Grid container className={classes.popoverContent}>
          {children}
        </Grid>
      </Popover>
    </React.Fragment>
  );
};

export default PopoverWorkBarChip;
