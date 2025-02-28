const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const mode = process.env.NODE_ENV || 'production';

const baseConfig = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    port: 9050,
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    fallback: {
      buffer: require.resolve('buffer'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
  mode,
};

module.exports = [
  {
    ...baseConfig,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: 'TronLinkExtensionCore',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this',
    },
  },
];
