const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Setup react-native-svg-transformer
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg', 'mjs'],
  extraNodeModules: {
    ...resolver.extraNodeModules,
    tslib: require.resolve('tslib/tslib.js'),
  },
  unstable_enablePackageExports: true
};

module.exports = config;
