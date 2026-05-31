import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <div class="menu-container" [class.menu-open]="isMenuOpen"> <!-- Ajout de la classe conditionnelle -->
      <button class="burger-icon" (click)="toggleMenu()">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </button>

      <nav class="menu-overlay" [class.open]="isMenuOpen">
        <button class="close-icon" (click)="toggleMenu()">X</button>
        <ul>
          <li><a routerLink="/" (click)="toggleMenu()">Quizz</a></li>
          <li><a routerLink="/about" (click)="toggleMenu()">Á propos</a></li>
          <li>
            <a href="https://code-enligne.fr/doc/questions-verifications-2018-banque-verifications-01_01_18-2.pdf"
               download="questions-verifications-2018.pdf"
               target="_blank"
               (click)="toggleMenu()">
              Télécharger PDF
            </a>
          </li>
        </ul>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
    imports: [
        RouterOutlet,
        RouterLink,
        CommonModule
    ],
    styleUrl: './app.scss'
})
export class App {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}