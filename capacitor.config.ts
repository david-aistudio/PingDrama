import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.david.pingdrama',
  appName: 'Ping Drama',
  webDir: 'out',
  server: {
    // GANTI INI DENGAN URL VERCEL LO YANG SUKSES DEPLOY
    url: 'https://ping-drama.vercel.app', 
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;