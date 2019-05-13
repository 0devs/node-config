import {IReceivePlugin} from "../../types";

const methodsReceiveSearchReceivePlugin = (
  plugins: IReceivePlugin[],
  sourcepath: string,
): IReceivePlugin | null => {
  let found = null;

  plugins.forEach((plugin) => {
    if (plugin.isMatch(sourcepath)) {
      found = plugin;
    }
  });

  return found;
};

export = methodsReceiveSearchReceivePlugin;
