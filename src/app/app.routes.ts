import {Routes} from '@angular/router';
import {Home} from './features/flashcards/pages/home/home';
import {About} from "./features/flashcards/pages/about/about";

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: "Quiz Permis B — les 100 fiches de vérifications de l'examen pratique",
        data: {
            description: "Révisez gratuitement les 100 fiches de vérifications intérieures, extérieures et de premiers secours de l'examen pratique du permis B. Application en ligne, installable et utilisable hors connexion."
        }
    },
    {
        path: 'about',
        component: About, // Utilisation du nom correct du composant
        title: 'À propos — Quiz Permis',
        data: {
            description: "Quiz Permis reprend la banque officielle des vérifications de l'examen pratique du permis B. Un outil de révision gratuit et hors ligne réalisé par Julien Dudek."
        }
    },
    {
        path: '**',
        redirectTo: ''
    }
];
