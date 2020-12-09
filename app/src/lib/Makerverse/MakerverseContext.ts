import { IOpenWorkShop } from '@openworkshop/lib';
import React from 'react';
import {MakerverseSessionFragment} from '../../api/graphql';
import {Workspace} from '../workspaces';
import {BackendConnection} from './apollo';
import {TTranslateFunc} from '@openworkshop/lib/OpenWorkShop';
import { StringMap } from 'i18next';

export interface IMakerverse {
  ows: IOpenWorkShop;

  connection: BackendConnection;

  session: MakerverseSessionFragment | undefined;

  workspaces: Workspace[];

  t: TTranslateFunc;
}

// Contexts require a default value...
const msg = 'Invalid access of empty context (use MakerverseProvider).';
export class EmptyMakerverse implements IMakerverse {
  get ows(): IOpenWorkShop { throw new Error(msg); }

  get connection(): BackendConnection { throw new Error(msg); }

  get session(): MakerverseSessionFragment | undefined { throw new Error(msg); }

  get workspaces(): Workspace[] { throw new Error(msg); }

  public t(key: string, opts?: StringMap) { return ''; }
}

export const MakerverseContext: React.Context<IMakerverse> = React.createContext<IMakerverse>(new EmptyMakerverse());
