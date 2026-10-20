import {DOCUMENT, inject, Injectable} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

export const SITE_URL = 'https://quizzpermis.byj6n.fr';

/**
 * Tient à jour, à chaque navigation, ce que lisent les moteurs de recherche et les réseaux sociaux :
 * description, URL canonique et balises Open Graph. Le titre est géré par le routeur (`title`).
 * La canonique ignore les paramètres (`?fiche=12`) : toutes les fiches vivent sur la même page.
 */
@Injectable({providedIn: 'root'})
export class SeoService {

    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly meta = inject(Meta);
    private readonly document = inject(DOCUMENT);

    start(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.update());
    }

    private update(): void {
        let route = this.route.snapshot;
        while (route.firstChild) route = route.firstChild;

        const path = this.router.parseUrl(this.router.url).root.children['primary']?.toString() ?? '';
        const url = `${SITE_URL}/${path}`;
        const title = this.document.title;
        const description: string | undefined = route.data['description'];

        this.canonical().setAttribute('href', url);
        this.meta.updateTag({property: 'og:url', content: url});
        this.meta.updateTag({property: 'og:title', content: title});
        this.meta.updateTag({name: 'twitter:title', content: title});
        if (description) {
            this.meta.updateTag({name: 'description', content: description});
            this.meta.updateTag({property: 'og:description', content: description});
            this.meta.updateTag({name: 'twitter:description', content: description});
        }
    }

    private canonical(): HTMLLinkElement {
        let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) {
            link = this.document.createElement('link');
            link.rel = 'canonical';
            this.document.head.appendChild(link);
        }
        return link;
    }
}
