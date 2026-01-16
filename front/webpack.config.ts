import path from 'path';
import webpack from 'webpack';
import { BuildMode, BuildPaths, buildWebpack } from './scripts';

interface EnvVariables {
  mode?: BuildMode;
  port?: number;
}

export default (env: EnvVariables) => {
  const paths: BuildPaths = {
    output: path.resolve(__dirname, 'build'),
    entry: path.resolve(__dirname, 'src', 'index'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    public: path.resolve(__dirname, 'public'),
    src: path.resolve(__dirname, 'src'),
  };

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3001,
    mode: env.mode ?? 'development',
    paths,
  });

  return config;
};
