const Webpack = require("webpack");
const Glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");

const configurator = {
  entries: function() {
    var entries = {
      application: ["./assets/css/application.scss"]
    };

    Glob.sync("./assets/*/*.*").forEach(entry => {
      if (
        entry === "./assets/css/application.scss" ||
        entry.includes("vendors")
      ) {
        return;
      }

      let key = entry.replace(
        /(\.\/assets\/(src|js|css|go)\/)|\.(ts|js|s[ac]ss|go)/g,
        ""
      );
      if (key.startsWith("_") || /(ts|js|s[ac]ss|go)$/i.test(entry) == false) {
        return;
      }

      if (entries[key] == null) {
        entries[key] = [entry];
        return;
      }

      entries[key].push(entry);
    });
    return entries;
  },

  plugins() {
    var plugins = [
      new CleanObsoleteChunks(),
      new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
      new CopyWebpackPlugin([{ from: "./assets", to: "" }], {
        copyUnmodified: true,
        ignore: ["css/**", "js/**", "src/**"]
      }),
      new Webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
      new ManifestPlugin({ fileName: "manifest.json" })
    ];

    return plugins;
  },

  moduleOptions: function() {
    return {
      rules: [
        {
          test: /\.css$/,
          use: ["css-loader"]
        },
        {
          test: /\.(s[ac]ss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: true } },
            { loader: "sass-loader", options: { sourceMap: true } }
          ]
        },
        { test: /\.ts?$/, use: "ts-loader", exclude: /node_modules/ },
        { test: /\.js?$/, loader: "babel-loader", exclude: /node_modules/ },
        {
          test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
          use: "file-loader?name=[name].[ext]?[hash]"
        },
        {
          test: /\.(woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader"
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: "file-loader" },
        { test: /\.go$/, use: "gopherjs-loader" }
      ]
    };
  },

  buildConfig: function() {
    // NOTE: If you are having issues with this not being set "properly", make
    // sure your GO_ENV is set properly as `buffalo build` overrides NODE_ENV
    // with whatever GO_ENV is set to or "development".
    const env = process.env.NODE_ENV || "development";

    var config = {
      mode: env,
      entry: configurator.entries(),
      output: {
        filename: "[name].[hash].js",
        path: `${__dirname}/public/assets`
      },
      plugins: configurator.plugins(),
      module: configurator.moduleOptions(),
      resolve: {
        extensions: [".ts", ".js", ".json"]
      }
    };

    if (env === "development") {
      config.plugins.push(new LiveReloadPlugin({ appendScriptTag: true }));
      return config;
    }

    const uglifier = new UglifyJsPlugin({
      uglifyOptions: {
        beautify: false,
        mangle: { keep_fnames: true },
        output: { comments: false },
        compress: {}
      }
    });

    config.optimization = {
      minimizer: [uglifier]
    };

    return config;
  }
};

module.exports = configurator.buildConfig();
