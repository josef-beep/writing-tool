import type { Configuration, ModuleOptions } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const rendererRules: Required<ModuleOptions>['rules'] = [
  ...rules,
  {
    test: /\.ttf$/,
    type: 'asset/resource',
  },
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
];

export const rendererConfig: Configuration = {
  devtool: 'source-map',
  module: {
    rules: rendererRules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '...'],
  },
};
