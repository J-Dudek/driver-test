import {Routes} from '@angular/router';
import {Home} from './features/flashcards/pages/home/home';
import {About} from "./features/flashcards/pages/about/about";

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'about',
        component: About // Utilisation du nom correct du composant
    }
];