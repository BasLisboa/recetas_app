import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'www',
  server: {
    cleartext: true // permite HTTP (útil en desarrollo)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,        // tiempo visible en milisegundos (3 seg)
      splashFullScreen: true,          // quita la barra de estado
      backgroundColor: '#91c786',      // color de fondo del splash (como el de tu logo)
      androidSplashResourceName: 'splash', // nombre del recurso generado
      showSpinner: false               // opcional: oculta el spinner de carga
    }
  }
};

export default config;
