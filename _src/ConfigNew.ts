export default class Config {
  private _logger: Logger | null = null;

  constructor(logger?: Logger) {
    if (logger) {
      this._logger = logger;
    }
  }

  public defaults(defaults: object | (() => Promise<object>)) {}

  public from(source: () => Promise<any>, destination: string) {}

  public validation(validateFn: (data: any) => Promise<object>) {}

  public read(): Promise<void> {}

  public validate(): Promise<void> {}

}
