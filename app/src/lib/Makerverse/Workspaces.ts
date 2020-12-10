import Workspace from 'lib/workspaces/workspace';

// export type WorkspaceMap = { [key: string]: Workspace };

export default class Workspaces {
  // _makerverse: IMakerverse;

  // _currentWorkspace?: Workspace = undefined;
  //
  // _all: WorkspaceMap = {};
  //
  // _log?: Logger = undefined;
  //
  // constructor(makerverse: IMakerverse) {
  //   this._makerverse = makerverse;
  // }
  //
  // get all(): WorkspaceMap {
  //   return this._all;
  // }
  //
  // get current(): Workspace | undefined {
  //   return this._currentWorkspace;
  // }
  //
  // set current(ws: Workspace | undefined) {
  //   this.log.debug('setting workspace to', ws?.id);
  //   if (this.current) {
  //     if (ws && ws.id === this.current.id) {
  //       return;
  //     }
  //     this.current.isActive = false;
  //   }
  //   this._currentWorkspace = ws;
  //   if (this.current) {
  //     this.current.isActive = true;
  //   }
  // }
  //
  // findByPath(path: string): Workspace | undefined {
  //   if (path.startsWith('/workspaces')) {
  //     path = path.substring('/workspaces'.length);
  //   }
  //   return _.find(this.all, (w) => {
  //     return w.path === path;
  //   });
  // }
  // //
  // // load(mv: IMakerverse, record: WorkspaceRecord): Workspace | undefined {
  // //   const id: string = record.id;
  // //   if (_.has(this.all, id)) {
  // //     this.all[id]._record = {
  // //       ...this.all[id]._record,
  // //       ...record,
  // //     };
  // //   } else {
  // //     this.all[id] = new Workspace(mv, record);
  // //   }
  // //   return this.all[id];
  // // }
  //
  // async unload(id: string): Promise<void> {
  //   if (!_.has(this.all, id)) {
  //     return;
  //   }
  //   const workspace = this.all[id];
  //   workspace.removeControllerEvents(workspace._controllerEvents);
  //   await workspace.closePort();
  //   delete this.all[id];
  // }
  //
  // disconnect(): void {
  //   Object.keys(this.all).map((id) => {
  //     const workspace: Workspace = this.all[id];
  //     void workspace.controller.disconnect();
  //   });
  // }
}
