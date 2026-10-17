import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  output: { filename: '[name].cjs' },
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: { index: './src/desktop/main.ts', 'utility-host': './src/desktop/utility-host.ts' },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
