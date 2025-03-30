const webpack = require("webpack");

module.exports = function override(config, env) {
  // Fix for webpack-manifest-plugin
  if (env === "production") {
    // Find the ManifestPlugin instance
    const manifestPluginIndex = config.plugins.findIndex(
      (plugin) =>
        plugin.constructor &&
        plugin.constructor.name === "WebpackManifestPlugin"
    );

    if (manifestPluginIndex !== -1) {
      // Remove the problematic plugin
      config.plugins.splice(manifestPluginIndex, 1);
    }
  }

  // Add support for MDX files
  config.module.rules.push({
    test: /\.mdx?$/,
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        loader: "@mdx-js/loader",
      },
    ],
  });

  // Add .mdx extension to the resolved extensions
  config.resolve.extensions.push(".mdx", ".md");

  // Add fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    util: require.resolve("util/"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    url: require.resolve("url/"),
    path: require.resolve("path-browserify"),
    fs: false,
  };

  return config;
};
