export interface IFromItem {
  sourcepath: string; // | string[];
  to: string;
}

export interface IReceivePlugin {
  type: "receive";
  name: string;
  init: (options: any) => Promise<void>;
  isMatch: (sourcepath: string) => boolean;
  read: (sourcepath: string) => Promise<object>;
}

export type IReceivePluginClass = new (logger?: any) => IReceivePlugin;
// export interface IReceivePluginClass {
//   new (logger?: any): IReceivePlugin;
// }

export type Name = string | string[];
export type Value = null | any[] | string | number | object | boolean;
export type ReturnValue = Value | undefined;
export type Data = any;
export type ValidationFunction = (data: Data) => Promise<boolean>;

export interface IFoundedReceivePlugin {
  from: IFromItem;
  plugin: IReceivePlugin;
}
