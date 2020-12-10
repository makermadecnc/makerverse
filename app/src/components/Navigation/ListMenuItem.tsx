import {ListItem, ListItemText, ListItemIcon, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';

interface OwnProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  subcomponent?: React.ReactNode;
}

type Props = OwnProps;

const ListMenuItem: FunctionComponent<Props> = (props) => {
  const { icon, title, to, subcomponent } = props;
  const location = useLocation();
  const selected = location.pathname === to;

  const CustomLink = React.useMemo(() =>
    React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
      (props, ref) => <Link ref={ref} to={to} {...props} />
    ), [to]
  );

  return (
    <ListItem selected={selected} button component={CustomLink}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={<Typography variant='h6'>{title}</Typography>} secondary={subcomponent} />
    </ListItem>
  );
};

export default ListMenuItem;
