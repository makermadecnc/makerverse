import {ListItem, ListItemText, ListItemIcon, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';

interface OwnProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  subtitle?: string;
}

type Props = OwnProps;

const ListMenuItem: FunctionComponent<Props> = (props) => {
  const { icon, title, to, subtitle } = props;
  const location = useLocation();
  const selected = location.pathname === to;

  const s = subtitle ? <Typography variant='subtitle2'>{subtitle}</Typography> : null;
  //
  // const CustomLink = React.useMemo(
  //   () =>
  //     React.forwardRef<HTMLAnchorElement, Props>((linkProps, ref) => (
  //       <Link ref={ref} to={ to } />
  //     )),
  //   [to],
  // );

  // const CustomLink = (p: unknown) => <Link to={to} {...p} />;

  const CustomLink = React.useMemo(() =>
    React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
      (props, ref) => <Link ref={ref} to={to} {...props} />
    ), [to]
  );

  return (
    <ListItem selected={selected} button component={CustomLink}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={<Typography variant='h6'>{title}</Typography>} secondary={s} />
    </ListItem>
  );
};

export default ListMenuItem;
