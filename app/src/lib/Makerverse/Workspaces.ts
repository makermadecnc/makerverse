import { IOpenWorkShop } from '@openworkshop/lib';
import {Logger} from '@openworkshop/lib/utils/logging/Logger';
import _ from 'lodash';
import Workspace from 'lib/workspaces/workspace';
import {WorkspaceRecord} from '../../lib/workspaces/types';

export type WorkspaceMap = { [key: string]: Workspace };

export default class Workspaces {
  _ows?: IOpenWorkShop;

  _currentWorkspace?: Workspace = undefined;

  _all: WorkspaceMap = {};

  _log?: Logger = undefined;

  constructor(ows?: IOpenWorkShop) {
    this._ows = ows;
    if (ows) this.log.info('Created workspaces');
  }

  get ows(): IOpenWorkShop {
    if (!this._ows) throw new Error('Invalid access of workspaces on empty context.');
    return this._ows;
  }

  get log(): Logger {
    if (!this._log) this._log = this.ows.logManager.getLogger('workspaces');
    return this._log;
  }

  get all(): WorkspaceMap {
    this.ows; // throws exception if empty.
    return this._all;
  }

  get current(): Workspace | undefined {
    this.ows; // throws exception if empty.
    return this._currentWorkspace;
  }

  set current(ws: Workspace | undefined) {
    this.ows; // throws exception if empty.
    this.log.debug('setting workspace to', ws?.id);
    if (this.current) {
      if (ws && ws.id === this.current.id) {
        return;
      }
      this.current.isActive = false;
    }
    this._currentWorkspace = ws;
    if (this.current) {
      this.current.isActive = true;
    }
  }

  findByPath(path: string): Workspace | undefined {
    this.ows; // throws exception if empty.
    if (path.startsWith('/workspaces')) {
      path = path.substring('/workspaces'.length);
    }
    return _.find(this.all, (w) => {
      return w.path === path;
    });
  }

  load(record: WorkspaceRecord): Workspace | undefined {
    this.ows; // throws exception if empty.
    const id: string = record.id;
    if (_.has(this.all, id)) {
      this.all[id]._record = {
        ...this.all[id]._record,
        ...record,
      };
    } else {
      this.all[id] = new Workspace(this.ows, record);
    }
    return this.all[id];
  }

  async unload(id: string): Promise<void> {
    this.ows; // throws exception if empty.
    if (!_.has(this.all, id)) {
      return;
    }
    const workspace = this.all[id];
    workspace.removeControllerEvents(workspace._controllerEvents);
    await workspace.closePort();
    delete this.all[id];
  }

  disconnect(): void {
    this.ows; // throws exception if empty.
    Object.keys(this.all).map((id) => {
      const workspace: Workspace = this.all[id];
      void workspace.controller.disconnect();
    });
  }
}
