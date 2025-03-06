  import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
  import { provideRouter } from '@angular/router';

  import { routes } from './app.routes';

  import { MessageService } from 'primeng/api';

  import { provideHttpClient } from '@angular/common/http';

  import { providePrimeNG } from 'primeng/config';

  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

  import Aura from '@primeng/themes/aura';





  import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
  import {getFirestore, provideFirestore} from '@angular/fire/firestore';


  const firebaseConfig = {
    apiKey: "AIzaSyBx9t9qKwV8ePEeoCKmhfpwIQ5qUqbrcf0",
    authDomain: "fisio-data.firebaseapp.com",
    projectId: "fisio-data",
    storageBucket: "fisio-data.firebasestorage.app",
    messagingSenderId: "1073759402153",
    appId: "1:1073759402153:web:411fe21eef49f3329f91b8"
  };

  export const appConfig: ApplicationConfig = {
    providers: [

      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideHttpClient(),
      provideAnimationsAsync(),
      providePrimeNG({
        theme: {
          preset: Aura
        }
      }) ,
      MessageService
    ]
  };
