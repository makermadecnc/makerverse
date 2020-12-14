import React, { FunctionComponent } from 'react';
import usePromise from 'react-promise-suspense';
import { Redirect } from 'react-router-dom';
import {useOpenController} from '@openworkshop/ui/open-controller/Context';

interface OwnProps {
  to: string;
}

type Props = OwnProps;

const ReconnectRedirect: FunctionComponent<Props> = (props) => {
  const makerverse = useOpenController();
  const { connection } = makerverse;

  usePromise(async () => await connection.reconnect(), [connection]);

  return (<Redirect to={props.to} />);
};

export default ReconnectRedirect;
