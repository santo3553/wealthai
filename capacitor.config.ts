import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.santo.wealthai',
  appName: 'WealthAI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
