import {PortStatusFragment} from '../../api/graphql';

export interface IMaybeHavePortStatus {
  port?: PortStatusFragment;
}
