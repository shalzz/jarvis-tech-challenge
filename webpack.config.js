// tslint:disable:no-implicit-dependencies
const path = require('path')
const webpack = require('webpack')

// webpack plugins
const CopyWebpackPlugin = require("copy-webpack-plugin");
// postcss plugins
const autoprefixer = require("autoprefixer");

const mode = process.env.NODE_ENV || 'production'
const isProd = function() {
  return process.env.NODE_ENV === "production";
};

const buildConfig = {
  output: {
    filename: "[name].js",
    publicPath: "/",
    path: path.join(__dirname, "build/app"),
  },
  entry: {
    bundle: path.join(__dirname, "src/index.tsx"),
    vendor_bundle: ["react", "react-dom", "web3", "eth-crypto", "@truffle/contract", "bluebird", "ethereumjs-util"],
  },
  mode,
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // copy files in public to build
    new CopyWebpackPlugin([{
      context: "public",
      from: {
        dot: false,
        glob: "**/*",
      },
      to: path.join(__dirname, "build/app/"),
    }]),
  ],
  module: {
    rules: [
      // compile ts
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        test: /\.tsx?$/,
      },
      // css loader
      // source maps are generated only for dev builds
      // css compression is only used for prod builds
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader", options: { sourceMap: !isProd() } },
          {
            loader: "css-loader", options: {
              localIdentName: isProd() ? "[hash:base64]" : "[path][name]__[local]__[hash:base64:6]",
              minimize: isProd(),
              modules: true,
              sourceMap: !isProd(),
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer({
                browsers: [
                  ">1%",
                  "last 4 versions",
                  "Firefox ESR",
                  "not ie < 9",
                ],
              })],
              sourceMap: !isProd(),
            },
          },
        ],
      },
      // file loader for media assets
      {
        exclude: [
          /\.(html?)$/,
          /\.(ts|tsx|js|jsx)$/,
          /\.css$/,
          /\.json$/,
        ],
        loader: "file-loader",
        query: {
          name: "[hash].[ext]",
          outputPath: "media/",
          publicPath: "/",
        },
      },
    ],
  },
};

if (isProd()) {
  // Production build tweaks
  buildConfig.devtool = false;
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("production") },
    }),
  ]);
} else {
  // Development build tweaks
  buildConfig.devtool = "source-map";
  const buildConfigModule = buildConfig.module;
  buildConfigModule.rules = (buildConfigModule.rules || []).concat([
    // tslint
    {
      enforce: "pre",
      exclude: /node_modules/,
      loader: "tslint-loader",
      test: /\.tsx?$/,
    },
  ]);
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("development") },
    }),
    // exclude source mapping for vendor libs
    new webpack.SourceMapDevToolPlugin({
      exclude: /^(vendor_).*\.js$/,
      filename: "[file].map",
    }),
  ]);
}

module.exports = buildConfig;
