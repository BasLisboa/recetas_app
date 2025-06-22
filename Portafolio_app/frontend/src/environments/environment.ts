// environment.ts
// Configuración de entorno para desarrollo
// Este archivo puede ser reemplazado por environment.prod.ts para producción usando fileReplacements en angular.json

const baseUrl = 'https://affiliated-aging-survive-creation.trycloudflare.com';
const shareUrl = 'https://TUAPP.web.app';
export const environment = {
  production: false,

  // URL del backend (Express, Cloud Functions, etc.)
  //apiUrl: 'http://localhost:3000/api',
  Url: baseUrl,
  apiUrl: `${baseUrl}/api`,
  shareUrl: shareUrl,

  // Configuración de Firebase (credenciales públicas, no secretas)
  firebase: {
    apiKey: "AIzaSyCFXl8sihWWrKRCnBi_heeQfJfrrDGOnFI",
    authDomain: "guardar-foto-d4a53.firebaseapp.com",
    projectId: "guardar-foto-d4a53",
    storageBucket: "guardar-foto-d4a53.firebasestorage.app",
    messagingSenderId: "621913189584",
    appId: "1:621913189584:web:94ad3d03301d6e59d1c2d5",

    measurementId: "G-678ZX5K4YC"       // opcional, sólo para analytics
  },
  adminUser: {
    email: 'bas.lisboa@duocuc.cl',
    password: 'bas1821.'
  }
} 

/*
 * Para debugging en modo desarrollo, puedes importar este archivo para ignorar
 * algunos errores relacionados con zones en Angular.
 * No debe usarse en producción por impacto en rendimiento.
 */
// import 'zone.js/plugins/zone-error';  // Incluido con Angular CLI
