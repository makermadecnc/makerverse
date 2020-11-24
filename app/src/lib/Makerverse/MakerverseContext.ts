import { ApolloClient, ApolloQueryResult, NormalizedCacheObject } from '@apollo/client';
import { IOpenWorkShop } from '@openworkshop/lib';
import {Logger} from '@openworkshop/lib/utils/logging/Logger';
import Log from 'js-logger';
import React from 'react';
import {AuthenticateDocument, AuthenticateQuery, MakerverseUser} from '../../api/graphql';
import analytics from '../analytics';
import Workspaces from './Workspaces';

let i = 0;

export interface IMakerverse {
  ows: IOpenWorkShop;

  user: MakerverseUser | undefined;

  log: Logger;

  workspaces: Workspaces;
}

export class Makerverse implements IMakerverse {
  _ows?: IOpenWorkShop = undefined;

  _log?: Logger = undefined;

  _user?: MakerverseUser = undefined;

  _workspaces: Workspaces;

  _i = -1;

  constructor(ows?: IOpenWorkShop) {
    this._workspaces = new Workspaces(ows);
    if (ows) this.ows = ows;

    // const errLink = onError((r) => {
    //   this.log.warn('err', r);
    //   if (r.response) r.response.errors = undefined;
    // });

    this._i = i;
    i++;
    if (this._i > 1) {
      throw new Error('Invalid attempt to create a second workspace context.');
    }
  }

  // async resume(): Promise<LoginResponse> {
  //   const oidcUser = await this.ows.authManager.getUser();
  //   const token: string | undefined = oidcUser ? oidcUser.access_token : undefined;
  //   if (!token || token.length <= 0) {
  //     this.log.debug('No token found in OIDC or storage');
  //     return {};
  //   }
  //   this.log.debug('resuming...');
  //   try {
  //     return {};
  //   } catch (e) {
  //     this.log.error('resume', e);
  //     return {};
  //   }
  // }
  //
  // async login(token: string): Promise<LoginResponse> {
  //   const result: ApolloQueryResult<AuthenticateQuery> = await this.ows.apolloClient.query({
  //     query: AuthenticateDocument,
  //     variables: { token: token },
  //     context: { clientName: 'makerverse' },
  //   });
  //   const res: LoginResponse = {
  //     response: result.data ? result.data.makerverseUser : undefined,
  //     error: result.error,
  //   };
  //   if (!res.response && !res.error) {
  //     if (result.errors && result.errors.length > 0) {
  //       res.error = result.errors[0];
  //     } else {
  //       res.error = new Error('No user in response.');
  //     }
  //   }
  //   this._user = res.response;
  //   result.errors = undefined;
  //   return res;
  // }

  get ows(): IOpenWorkShop {
    if (!this._ows) {
      Log.warn('OWS Failure', this);
      throw new Error('Invalid access of workspaces on empty context.');
    }
    return this._ows;
  }

  set ows(ows) {
    if (this._ows === ows) {
      return;
    }
    this._ows = ows;
    this._workspaces = new Workspaces(ows);
    analytics.initialize(ows);
  }

  get user(): MakerverseUser | undefined {
    return this._user;
  }

  set user(user: MakerverseUser | undefined) {
    this._user = user;
  }

  get workspaces(): Workspaces {
    return this._workspaces;
  }

  get log(): Logger {
    if (!this._log) this._log = this.ows.logManager.getLogger('makerverse');
    return this._log;
  }
}

// export function loadMakerverse(ows: IOpenWorkShop): Makerverse { return new Makerverse(ows) }

const empty = new Makerverse();
export const MakerverseContext: React.Context<IMakerverse> = React.createContext<IMakerverse>(empty);
