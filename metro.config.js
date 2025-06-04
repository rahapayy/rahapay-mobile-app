const { withNativeWind } = require('nativewind/metro');

module.exports = (() => {
  const config = {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
    },
    resolver: {
      assetExts: ["png", "jpg", "jpeg", "gif", "ttf", "otf", "woff", "woff2"],
      sourceExts: ["js", "jsx", "ts", "tsx", "svg"]
    }
  };

  return withNativeWind(config, { input: './global.css' });
})();