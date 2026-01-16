import { Configuration } from 'webpack';
import { BuildOptions } from './types';

export function buildResolvers(
  options: BuildOptions
): Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.js', '.styl'],
    alias: {
      '@': options.paths.src,
    },
  };
}
