import { IOpenWorkShop } from '@openworkshop/lib';
import {Logger} from '@openworkshop/lib/utils/logging/Logger';
import React from 'react';
import {IMakerverseUser} from './User';
import Workspaces from './Workspaces';

let i = 0;

export interface IMakerverse {
  ows: IOpenWorkShop;

  user: IMakerverseUser | undefined;

  workspaces: Workspaces;
}

class Makerverse implements IMakerverse {
  _ows?: IOpenWorkShop = undefined;

  _log?: Logger = undefined;

  _user?: IMakerverseUser = undefined;

  _workspaces: Workspaces;

  _i = -1;

  constructor(ows?: IOpenWorkShop) {
    if (!ows && i > 0) {
      throw new Error('OWS core is required.');
    }
    this._ows = ows;
    this._workspaces = new Workspaces(ows);
    this._i = i;
    i++;
    if (this._i > 1) {
      throw new Error('Invalid attempt to create a second workspace context.');
    }
  }

  async resume(): Promise<boolean> {
    await new Promise((r) => setTimeout(() => {
      this.log.debug('hello');
    }, 100));
    return false;
  }

  get ows(): IOpenWorkShop {
    if (!this._ows) {
      throw new Error('Invalid access of workspaces on empty context.');
    }
    return this._ows;
  }

  get user(): IMakerverseUser | undefined {
    return this._user;
  }

  get workspaces(): Workspaces {
    return this._workspaces;
  }

  get log(): Logger {
    if (!this._log) this._log = this.ows.logManager.getLogger('workspaces');
    return this._log;
  }
}

export function loadMakerverse(ows: IOpenWorkShop): Makerverse {
  const mv = new Makerverse(ows);
  // await mv.resume();
  return mv;
}

const empty = new Makerverse();
export const MakerverseContext: React.Context<Makerverse> = React.createContext<Makerverse>(empty);
