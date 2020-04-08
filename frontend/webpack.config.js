const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devServer:{
        contentBase:path.resolve(__dirname,"./src"),
        historyApiFallback:true
    },
  entry:{
      'index':'./src/index.js'
  },

  output:{
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  //Setup loaders
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],


  module: { 
    rules: [
        {
           test: /\.js?$/,
           exclude: /(node_modules)/,
           use: [
                 {
                  loader: 'babel-loader',
                    options:{
                        presets: [
                    "@babel/preset-env",
                    {
                      plugins: [
                        '@babel/plugin-proposal-class-properties'
                      ]
                    },
                    "@babel/preset-react"
                ]
            }
              }
              ]
        }, {
          test: /\.css$/,
           use: ['style-loader', 'css-loader']
        } 
      ] 
   }
};