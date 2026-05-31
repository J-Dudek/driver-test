import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {QuestionService} from '../../../../core/services/question.service';
import {QuestionGroup} from '../../../../core/models/question-group.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './home.html',
    styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {

    groups: QuestionGroup[] = [];
    displayedGroup?: QuestionGroup;
    searchId?: number;
    /** PWA install state **/
    deferredPrompt: any = null;
    showInstallBanner = false;
    private service = inject(QuestionService);

    constructor() {
        window.addEventListener('beforeinstallprompt', this.installPromptHandler);
    }

    ngOnInit(): void {
        this.service.loadQuestions()
            .subscribe(data => {
                this.groups = data;
            });
    }

    ngOnDestroy(): void {
        window.removeEventListener('beforeinstallprompt', this.installPromptHandler);
    }

    search(): void {

        const found = this.groups.find(
            g => g.numero === this.searchId
        )
        this.searchId = undefined;

        if (!found) return;

        this.displayedGroup = {
            ...found,
            questions: found.questions.map(q => ({
                ...q,
                flipped: false
            }))
        };
    }

    randomQuestion(): void {

        if (!this.groups.length) return;

        const randomIndex = Math.floor(Math.random() * this.groups.length);
        const random = this.groups[randomIndex];

        this.displayedGroup = {
            ...random,
            questions: random.questions.map(q => ({
                ...q,
                flipped: false
            }))
        };
    }

    flip(question: any): void {
        question.flipped = !question.flipped;
    }

    /** PWA INSTALL **/
    installApp(): void {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();

        this.deferredPrompt.userChoice.then(() => {
            this.deferredPrompt = null;
            this.showInstallBanner = false;
        });
    }

    closeInstallBanner(): void {
        this.showInstallBanner = false;
    }

    openManualInstallHelp() {
        alert(
            "Sur Firefox : Menu → Installer cette application (ou Ajouter à l'écran d'accueil)"
        );
    }

    /** listener ref (pour cleanup propre) **/
    private installPromptHandler = (event: any) => {
        event.preventDefault(); // bloque popup auto navigateur
        this.deferredPrompt = event;
        this.showInstallBanner = true;
    };
}