import { CircularProgress, Container } from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import {MakerverseUser, useAuthenticateQuery} from '../../api/graphql';
import {MakerverseContext} from '../../lib/Makerverse';
import useStyles from './Styles';

interface OwnProps {
  token?: string;
  onError?: (e: Error) => void;
  onUser?: (u: MakerverseUser) => void;
  children: React.ReactNode;
}

type Props = OwnProps;

const TokenValidator: FunctionComponent<Props> = (props) => {
  const log = useLogger(TokenValidator);
  const { onError, token, onUser } = props;
  const makerverse = React.useContext(MakerverseContext);
  const tok = token ?? makerverse.ows.user?.access_token;

  if (!tok) {
    log.warn('no token');
    return <Redirect to="/login"/>;
  }

  const classes = useStyles();
  const { loading, data, error } = useAuthenticateQuery({ variables: { token: tok } });

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
    if (data && data.makerverseUser) {
      makerverse.user = data.makerverseUser;
      if (onUser) {
        onUser(data.makerverseUser);
      }
    }
  }, [error, data, onError, onUser]);

  if (error) return onError ? <div /> : <AlertList error={error} />;

  if (loading) return <Container className={classes.centered}><CircularProgress /></Container>;

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default TokenValidator;
