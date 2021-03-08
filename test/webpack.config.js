const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = () => {
    return {
        entry: path.resolve(__dirname, "test.js"),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader"
                        },
                        {
                            loader: "eslint-loader",
                            options: {
                                configFile: path.resolve(__dirname, "eslintrc.js")
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: path.resolve(__dirname, "index.html")
            })
        ]
    };
};