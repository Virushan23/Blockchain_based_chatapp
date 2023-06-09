const path = require('path');

module.exports = {
  mode: 'development',
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  
  
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    open: true,
  },
  
  
};
