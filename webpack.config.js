var path = require('path'),
  webpack = require('webpack'),
  nib = require('nib'),
  jeet = require('jeet');

module.exports = {
  entry: {
    'game': './src/main.js'
  },
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: '[name].pack.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three'
    }),
    //new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  stylus:{
    use: [nib(), jeet()]
  }
}
