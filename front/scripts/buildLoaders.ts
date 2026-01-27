import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ModuleOptions } from 'webpack';
// import ReactRefreshTypeScript from 'react-refresh-typescript';
import { BuildOptions } from './types';

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
  const isDev = options.mode === 'development';

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  };

  const cssLoader = {
    test: /\.css$/,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          // url: (url) => !/^\/.*/.test(url),
          url: false,
        },
      },
    ],
  };

  // const scssLoader = {
  //   test: /\.s[ac]ss$/i,
  //   use: [
  //     isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  //     'css-loader',
  //     'sass-loader',
  //   ],
  // };

  const stylusLoader = {
    test: /\.styl$/,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      'stylus-loader',
    ],
  };

  const tsLoader = {
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          // getCustomTransformers: () => ({
          //   before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
          // }),
        },
      },
    ],
  };

  const workerLoader = {
    test: /\.worker\.ts$/,
    type: 'asset/resource',
    generator: {
      filename: '[contenthash].js', // нужен файл .js!
    },
  };

  return [
    assetLoader,
    workerLoader,
    tsLoader,
    cssLoader,
    // scssLoader,
    stylusLoader,
  ];
}
