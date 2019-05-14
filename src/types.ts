export type Logger = any;

export type Source = () => Promise<any>;
export type Destination = string;

export interface IFrom {
  source: Source;
  destination: Destination;
  optional: boolean;
  defaults: boolean;
};

export type Validation = ((data: any) => Promise<any>) | null;
