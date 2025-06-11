const baseUrl = 'https://strength-livestock-vietnamese-contests.trycloudflare.com';

export const environment = {
  production: true,
  
   // URL del backend (Express, Cloud Functions, etc.)
  //apiUrl: 'http://localhost:3000/api',
  Url: baseUrl,
  apiUrl: `${baseUrl}/api`,


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
