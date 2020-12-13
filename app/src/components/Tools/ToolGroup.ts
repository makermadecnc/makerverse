import { ITool, IToolGroup } from './types';

class ToolGroup implements IToolGroup {
  get id(): string { return this._id; }
  private readonly _id: string;

  get icon(): string { return this._icon; }
  private readonly _icon: string;

  get titleKey(): string { return this._title; }
  private readonly _title: string;

  get tools(): ITool[] { return this._tools; }
  private readonly _tools: ITool[];

  constructor(title: string, icon: string, ...args: string[]) {
    this._id = title.toLowerCase();
    this._icon = icon;
    this._title = title;
    this._tools = args.map((path) => {
      return { id: `${this.id}-${path}`, componentPath: path, titleKey: path };
    });
  }
}

export default ToolGroup;
