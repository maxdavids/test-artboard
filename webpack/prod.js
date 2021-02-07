const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './src/share.ts',
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.mp4$/,
        loader: 'file-loader',
      },
      {
        test: /\.jpg$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: true,
            esModule: false,
          },
        }]
      },
      {
        test: /\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: true,
            esModule: false,
          },
        }]
      },
      {
        test: /\.fbx$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: true,
            esModule: false,
          },
        }]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
  ],
}
