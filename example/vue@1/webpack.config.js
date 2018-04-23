/*
* @Author: dengjiayao
* @Date:   2017-11-20 13:54:50
* @Last Modified by:   dengjiayao
* @Last Modified time: 2017-11-20 13:54:56
*/
module.exports = function(rcObject) {
  return {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                loaders: {
                  js:
                    'babel-loader?' +
                    JSON.stringify(rcObject.babel) +
                    '!eslint-loader?' +
                    JSON.stringify(rcObject.eslint),
                  css: 'vue-style-loader!css-loader!postcss-loader?sourceMap=true'
                }
              }
            }
          ]
        }
      ]
    }
  }
}
