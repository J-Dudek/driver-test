import {Component, computed, DestroyRef, HostListener, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../../../../core/services/question.service';
import {QuestionGroup} from '../../../../core/models/question-group.model';

const SEEN_KEY = 'quiz-permis:fiches-vues';

/** Les trois questions d'une fiche suivent toujours le même ordre à l'examen. */
const QUESTION_KINDS = ['Vérification', 'Sécurité routière', 'Premiers secours'];

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './home.html',
    styleUrls: ['./home.scss']
})
export class Home implements OnInit {

    readonly kinds = QUESTION_KINDS;
    readonly groups = signal<QuestionGroup[]>([]);
    readonly current = signal<number | undefined>(undefined);
    /** Index des cartes retournées sur la fiche courante. */
    readonly revealed = signal<ReadonlySet<number>>(new Set());
    readonly seen = signal<ReadonlySet<number>>(loadSeen());
    readonly notFound = signal(false);
    readonly loadError = signal(false);
    readonly canInstall = signal(false);

    readonly total = computed(() => this.groups().length);
    readonly displayedGroup = computed(() => this.groups().find(g => g.numero === this.current()));
    readonly allRevealed = computed(() => {
        const group = this.displayedGroup();
        return !!group && this.revealed().size === group.questions.length;
    });

    searchId?: number;

    private readonly service = inject(QuestionService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private deferredPrompt: any = null;

    constructor() {
        const onPrompt = (event: Event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            this.canInstall.set(true);
        };
        window.addEventListener('beforeinstallprompt', onPrompt);
        inject(DestroyRef).onDestroy(() => window.removeEventListener('beforeinstallprompt', onPrompt));
    }

    ngOnInit(): void {
        this.service.loadQuestions().subscribe({
            next: data => {
                this.groups.set(data);
                this.showFromUrl();
            },
            error: () => this.loadError.set(true)
        });
        this.route.queryParamMap.subscribe(() => this.showFromUrl());
    }

    search(): void {
        const id = Number(this.searchId);
        const exists = this.groups().some(g => g.numero === id);
        this.notFound.set(!exists);
        if (!exists) return;
        this.searchId = undefined;
        this.goTo(id);
    }

    randomQuestion(): void {
        const groups = this.groups();
        if (!groups.length) return;
        // Privilégie les fiches pas encore vues, pour couvrir tout le programme.
        const pool = groups.filter(g => !this.seen().has(g.numero) && g.numero !== this.current());
        const source = pool.length ? pool : groups.filter(g => g.numero !== this.current());
        this.goTo(source[Math.floor(Math.random() * source.length)].numero);
    }

    previous(): void {
        const n = this.current();
        if (n !== undefined && n > 1) this.goTo(n - 1);
    }

    next(): void {
        const n = this.current();
        if (n !== undefined && n < this.total()) this.goTo(n + 1);
    }

    goTo(numero: number): void {
        this.notFound.set(false);
        this.router.navigate([], {queryParams: {fiche: numero}});
    }

    flip(index: number): void {
        this.revealed.update(set => {
            const copy = new Set(set);
            copy.has(index) ? copy.delete(index) : copy.add(index);
            return copy;
        });
    }

    toggleAll(): void {
        const group = this.displayedGroup();
        if (!group) return;
        this.revealed.set(this.allRevealed() ? new Set() : new Set(group.questions.map((_, i) => i)));
    }

    resetProgress(): void {
        this.seen.set(new Set());
        saveSeen(this.seen());
    }

    installApp(): void {
        if (!this.deferredPrompt) return;
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
            this.deferredPrompt = null;
            this.canInstall.set(false);
        });
    }

    /** Flèches gauche/droite pour passer d'une fiche à l'autre, hors saisie. */
    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement | null;
        if (target?.closest('input, textarea, select') || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowLeft') this.previous();
        if (event.key === 'ArrowRight') this.next();
    }

    private showFromUrl(): void {
        const numero = Number(this.route.snapshot.queryParamMap.get('fiche'));
        const exists = this.groups().some(g => g.numero === numero);
        if (!exists) {
            this.current.set(undefined);
            return;
        }
        if (numero === this.current()) return;
        this.current.set(numero);
        this.revealed.set(new Set());
        this.seen.update(set => new Set(set).add(numero));
        saveSeen(this.seen());
    }
}

function loadSeen(): Set<number> {
    try {
        const raw = localStorage.getItem(SEEN_KEY);
        return new Set(raw ? (JSON.parse(raw) as number[]) : []);
    } catch {
        return new Set();
    }
}

function saveSeen(seen: ReadonlySet<number>): void {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
    } catch {
        // Stockage indisponible (navigation privée…) : la progression n'est simplement pas mémorisée.
    }
}
