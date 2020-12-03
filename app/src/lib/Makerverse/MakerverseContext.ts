import { IOpenWorkShop } from '@openworkshop/lib';
import React from 'react';
import {MakerverseSessionFragment} from '../../api/graphql';
import {Workspace} from '../workspaces';
import {BackendConnection} from './apollo';

export interface IMakerverse {
  ows: IOpenWorkShop;

  connection: BackendConnection;

  session: MakerverseSessionFragment | undefined;

  workspaces: Workspace[];
}

// Contexts require a default value...
const msg = 'Invalid access of empty context (use MakerverseProvider).';
export class EmptyMakerverse implements IMakerverse {
  get ows(): IOpenWorkShop { throw new Error(msg); }

  get connection(): BackendConnection { throw new Error(msg); }

  get session(): MakerverseSessionFragment | undefined { throw new Error(msg); }

  get workspaces(): Workspace[] { throw new Error(msg); }
}

export const MakerverseContext: React.Context<IMakerverse> = React.createContext<IMakerverse>(new EmptyMakerverse());
