import {RenderMode, ServerRoute} from '@angular/ssr';

/**
 * Pages pré-rendues en HTML au build, pour que les moteurs de recherche lisent le contenu sans
 * exécuter le JavaScript. Le reste (URL inconnues) est rendu côté navigateur via index.csr.html.
 */
export const serverRoutes: ServerRoute[] = [
    {path: '', renderMode: RenderMode.Prerender},
    {path: 'about', renderMode: RenderMode.Prerender},
    {path: '**', renderMode: RenderMode.Client}
];
