import {
    ApplicationConfig,
    inject,
    isDevMode,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

import {routes} from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {AppUpdateService} from './core/services/app-update.service';
import {SeoService} from './core/services/seo.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withFetch()),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        provideAppInitializer(() => inject(AppUpdateService).start()),
        provideAppInitializer(() => inject(SeoService).start())
    ]
};
