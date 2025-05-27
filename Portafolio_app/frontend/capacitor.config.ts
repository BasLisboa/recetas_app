import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  server: {
    cleartext: true, // <-- permite HTTP
  },
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'www'
};

export default config;
