const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    util: require.resolve("util/"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    url: require.resolve("url/"),
  };

  return config;
};
