import {Component, HostListener, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {J6nLogoComponent} from './features/flashcards/components/j6n-logo-component/j6n-logo-component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        J6nLogoComponent
    ]
})
export class App {
    readonly pdfUrl = 'https://code-enligne.fr/doc/questions-verifications-2018-banque-verifications-01_01_18-2.pdf';
    readonly menuOpen = signal(false);

    toggleMenu(): void {
        this.menuOpen.update(open => !open);
    }

    @HostListener('document:keydown.escape')
    closeMenu(): void {
        this.menuOpen.set(false);
    }
}
