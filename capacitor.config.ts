import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chronos.app',
  appName: 'Chronos',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      backgroundColor: '#FAF6F0',
      style: 'LIGHT',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchAutoHide: true,
      autoHideDelay: 1500,
      backgroundColor: '#FAF6F0',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
  },
  android: {
    backgroundColor: '#FAF6F0',
    overScrollMode: 'never',
    allowMixedContent: false,
  },
};

export default config;
