const path = require('path')
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
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
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: "three"
    })
  ]
}
