const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./lib/minesweeper.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  devtool: "source-map"
};
