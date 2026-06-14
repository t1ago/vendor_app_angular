import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { INaturalPerson } from '@features/person/interfaces/natural-person.model';
import { PersonService } from '@features/person/services/person-service';
import { IMAGES } from '@shared/constants/images';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
    selector: 'app-natural-person-search',
    imports: [],
    templateUrl: './natural-person-search.html',
    styleUrl: './natural-person-search.scss',
})
export class NaturalPersonSearch implements OnInit {
    private personService = inject(PersonService);

    naturalPerson = input<INaturalPerson | null>(null);

    onSelect = output<INaturalPerson | null>();

    searchTerm = signal<string>('');

    results = signal<INaturalPerson[]>([]);

    selectedPerson = signal<INaturalPerson | null>(null);

    isSearching = signal<boolean>(false);

    private search$ = new Subject<string>();

    constructor() {
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term) => {
                    this.isSearching.set(true);
                    return this.personService.getNaturalPersonBy(term);
                }),
                takeUntilDestroyed()
            )
            .subscribe({
                next: (result) => {
                    this.results.set(result);
                    this.isSearching.set(false);
                },
                error: () => {
                    this.results.set([]);
                    this.isSearching.set(false);
                },
            });
    }

    ngOnInit(): void {
        if (this.naturalPerson() && this.naturalPerson()?.id != null) {
            this.selectedPerson.set(this.naturalPerson());
        }
    }

    onSearchInput(value: string): void {
        this.searchTerm.set(value);

        if (value.length >= 3) {
            this.search$.next(value);
        } else {
            this.results.set([]);
        }
    }

    onSelectPerson(person: INaturalPerson): void {
        this.selectedPerson.set(person);
        this.searchTerm.set('');
        this.results.set([]);
        this.onSelect.emit(person);
    }

    onRemove(): void {
        this.selectedPerson.set(null);
        this.searchTerm.set('');
        this.results.set([]);
        this.onSelect.emit(null);
    }

    get searchTermLabel(): string {
        return 'Sócio';
    }

    get selectedNameLabel(): string {
        return 'Nome';
    }

    get selectedSurnameLabel(): string {
        return 'Apelido';
    }

    get selectedRgLabel(): string {
        return 'RG';
    }

    get selectedCpfLabel(): string {
        return 'CPF';
    }

    get removeLabel(): string {
        return 'Remover';
    }

    get removeIcon(): string {
        return IMAGES.REMOVE;
    }
}
