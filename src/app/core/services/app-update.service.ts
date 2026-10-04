import {ApplicationRef, DestroyRef, inject, Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {filter, first} from 'rxjs';

const JUST_UPDATED_KEY = 'quiz-permis:vient-d-etre-mis-a-jour';
/** Une PWA installée peut rester ouverte des jours : on revérifie régulièrement. */
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

declare global {
    interface Window {
        j6n?: { toast(message: string, opts?: { tone?: string; duration?: number }): void };
    }
}

/**
 * Bascule automatiquement sur chaque nouvelle version déployée.
 *
 * Le service worker Angular met en cache toute l'application (JS, CSS, questions.json…) et
 * télécharge une nouvelle version en arrière-plan quand ngsw.json change — mais sans rien de
 * plus, l'onglet reste sur l'ancienne version jusqu'à ce que tous les onglets soient fermés.
 * Ici, dès qu'une version est prête, on recharge la page : le service worker sert alors la
 * nouvelle version et purge les caches de l'ancienne. La fiche courante est dans l'URL et la
 * progression dans localStorage, donc rien n'est perdu au rechargement.
 */
@Injectable({providedIn: 'root'})
export class AppUpdateService {

    private readonly swUpdate = inject(SwUpdate);
    private readonly appRef = inject(ApplicationRef);
    private readonly destroyRef = inject(DestroyRef);

    start(): void {
        this.announceIfJustUpdated();

        if (!this.swUpdate.isEnabled) return;

        this.swUpdate.versionUpdates
            .pipe(filter(event => event.type === 'VERSION_READY'))
            .subscribe(() => this.reload());

        // Cache corrompu ou version supprimée du serveur : seul un rechargement complet s'en sort.
        this.swUpdate.unrecoverable.subscribe(() => this.reload());

        this.appRef.isStable.pipe(first(stable => stable)).subscribe(() => this.check());

        const interval = setInterval(() => this.check(), CHECK_INTERVAL_MS);
        const onVisible = () => {
            if (document.visibilityState === 'visible') this.check();
        };
        document.addEventListener('visibilitychange', onVisible);
        this.destroyRef.onDestroy(() => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisible);
        });
    }

    private check(): void {
        this.swUpdate.checkForUpdate().catch(err => console.warn('Vérification de mise à jour impossible', err));
    }

    private reload(): void {
        try {
            sessionStorage.setItem(JUST_UPDATED_KEY, '1');
        } catch {
            // Stockage indisponible : on recharge quand même, sans le message de confirmation.
        }
        document.location.reload();
    }

    private announceIfJustUpdated(): void {
        try {
            if (!sessionStorage.getItem(JUST_UPDATED_KEY)) return;
            sessionStorage.removeItem(JUST_UPDATED_KEY);
        } catch {
            return;
        }
        window.j6n?.toast('Application mise à jour vers la dernière version.', {tone: 'success'});
    }
}
