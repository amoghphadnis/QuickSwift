const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


const config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "public"),
         publicPath: "/"
    },
    devServer: {
        static: {
          directory: path.join(__dirname, 'public'),
        },
        proxy: [
            {
              context: ['/api'],
              target: 'http://localhost:5000',
              pathRewrite: { '^/api': '' },
            }
          ],
        open: true,
        port: 7000, // You can specify any port you prefer
        host: "0.0.0.0",
        historyApiFallback: { index: "index.html" },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
              },
              {
                test: /\.css$/i,
                use: ["style-loader", "css-loader","postcss-loader"],
              },
              {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|jpeg)$/i,
                type: "asset",
              },
        ]

    },
      
    plugins: [
        new HtmlWebpackPlugin({
          title: "QuickSwift",
          template: "template_index.html", 
          filename: "./index.html",
        }),
      ],
      mode: "development",
}

module.exports = () => {
    return config;
  };
  