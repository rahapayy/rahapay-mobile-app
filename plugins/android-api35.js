const { withAndroidManifest, withGradleProperties } = require('expo/config-plugins');

const withAndroidApi35 = (config) => {
  // Update Android manifest for API 35
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    
    // Set target SDK version to 35
    if (androidManifest.manifest) {
      androidManifest.manifest['android:targetSdkVersion'] = '35';
    }
    
    return config;
  });

  // Update Gradle properties for 16KB page size support
  config = withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'android.targetSdkVersion',
      value: '35',
    });
    config.modResults.push({
      type: 'property',
      key: 'android.compileSdkVersion',
      value: '35',
    });
    config.modResults.push({
      type: 'property',
      key: 'android.enable16KbPageSizeSupport',
      value: 'true',
    });
    
    return config;
  });

  return config;
};

module.exports = withAndroidApi35;
