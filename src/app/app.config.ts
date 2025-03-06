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
    apiKey: "AIzaSyAZ0SZYaJxg3DQ0UZc60VS0OgwgcpXiBYY",
    authDomain: "fisio-data-ped.firebaseapp.com",
    projectId: "fisio-data-ped",
    storageBucket: "fisio-data-ped.firebasestorage.app",
    messagingSenderId: "632254468640",
    appId: "1:632254468640:web:a2f6946d9c009129a4a245"
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
