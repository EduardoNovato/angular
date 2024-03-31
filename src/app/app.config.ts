import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'todo-app-2fec1',
          appId: '1:922084613343:web:913360510fdc064dcf5d6a',
          storageBucket: 'todo-app-2fec1.appspot.com',
          apiKey: 'AIzaSyCSH9ukk4yYqQql0NuIMlvmTnysBKMHB9I',
          authDomain: 'todo-app-2fec1.firebaseapp.com',
          messagingSenderId: '922084613343',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
