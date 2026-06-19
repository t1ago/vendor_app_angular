# spec-pattern.md

Canonical reference for every feature in this Angular 21 SSR application.
**Always use `person` as the gold-standard example** — `category` and `coin` are outdated.

---

## 0. Feature Classification

Before reading anything else, classify the feature. This determines which sections of this spec apply and avoids reading irrelevant parts.

**Answer these two questions:**

1. Does the entity have sub-entities (e.g. addresses, items)?
2. Does the entity reference another entity via FK?

| Profile | Criteria | Canonical example | Sections that add complexity |
|---|---|---|---|
| **Basic CRUD** | No sub-entities, no FK | `category` | §4–8 only |
| **Advanced CRUD** | Has sub-entities and/or FK | `person` | §4–8 + master-detail form, sub-resolvers, union types |
| **Non-CRUD** | No list/form pattern (dashboard, report, wizard) | — | Stop — ask the user for context before acting |

> Skip sections that don't apply to the classified profile. Do not read person's sub-form or union-type code for a Basic CRUD feature.

---

## 0. Project Stack

Use this table when making any technical decision (API choice, import path, CSS class, test utility).

| Resource | Version | Reference |
|---|---|---|
| Angular | ^21.0.0 | https://angular.dev/docs |
| `@angular/forms` signals (experimental) | part of `@angular/forms ^21.0.0` | https://angular.dev/guide/signals/forms |
| `@angular/router` | ^21.0.0 | https://angular.dev/guide/routing |
| `@angular/ssr` | ^21.0.4 | https://angular.dev/guide/ssr |
| Bootstrap | **5.3.8** via CDN (not npm) | https://getbootstrap.com/docs/5.3 |
| `@ngx-translate/core` | ^18.0.0 | https://github.com/ngx-translate/core |
| RxJS | ~7.8.0 | https://rxjs.dev/api |
| TypeScript | ~5.9.2 | https://www.typescriptlang.org/docs |
| Unit tests | Vitest via `@angular/build:unit-test` + jsdom | https://vitest.dev/api |
| E2E | Playwright ^1.59.1 | https://playwright.dev/docs/intro |

**Key decisions implied by this stack:**
- Forms use `form()` / `submit()` / `required()` / `minLength()` / `pattern()` from `@angular/forms/signals` — NOT `ReactiveFormsModule` or `FormsModule`.
- CSS uses Bootstrap 5.3 utility classes directly in templates — no custom CSS unless strictly necessary.
- Signals are the primary state primitive (`signal()`, `computed()`, `WritableSignal`) — avoid `BehaviorSubject` for local state.
- Tests use Vitest's API (`describe`, `it`, `expect`, `beforeEach`) with Angular's `TestBed` — **do not import from `jasmine`**.
- SSR is currently disabled in `angular.json`; do not add SSR-specific guards (e.g. `isPlatformBrowser`) unless explicitly asked.

---

## 1. Base classes contract

Every feature inherits from one of these three base classes:

| Class | Location | Purpose |
|---|---|---|
| `BaseForm<MODEL, SERVICE>` | `@shared/classes/base-form` | Form state via `@angular/forms/signals`. Subclasses call `createForm()` in the constructor and override `onSaveAction()` / `onCancelAction()`. |
| `BaseList<MODEL, SERVICE>` | `@shared/classes/base-list` | List state as a `WritableSignal<MODEL[]>`. Loads resolver data via `loadTableConfig()`. Subclasses override `getTableConfig()` and action handlers. |
| `BaseRequestService<MODEL, DTO>` | `@shared/services/base-request-service` | HTTP wrapper. Subclasses set `basePath`, assign `this.request`, then call `this.resultObservable()`. Handles 401 and foreign-key errors centrally. |

### BaseForm — key members
- `model: WritableSignal<MODEL>` — set by `createForm()`.
- `formData: FieldTree<MODEL>` — the signal form tree; expose fields as `get formXxx()` getters.
- `saveControl: Signal<ISaveControlModel>` — tracks save state.
- `createForm(model, schemaFn)` — must be called in the constructor.
- `updateSaveControl(state, message)` — call before and after `service.save()`.
- `isDisabledSaveAction` / `isSaveAction` — bind to the submit button.

### BaseList — key members
- `model: WritableSignal<MODEL[]>` — populated by `loadData()` from route resolver.
- `tableConfig: Signal<ITableConfig<MODEL>>` — computed from `getTableConfig()` + `model()`.
- `loadTableConfig()` — call in constructor; sets up `model` and `tableConfig` together.
- `route`, `router` — pre-injected; use directly for navigation.

### BaseRequestService — key members
- `basePath: string` — override with the API resource path (e.g. `'/tiago/categoria'`).
- `APIPath` — getter returning `${host}${basePath}`.
- `request: Observable<Object>` — assign before calling `resultObservable()`.
- `resultObservable<RESULT>()` — wraps `request` with centralized 401 / FK-error handling.

---

## 2. Shared utilities

Import these from `@shared/*` — never re-implement locally.

| Utility | Import path | Usage |
|---|---|---|
| `ToastService` | `@shared/components/toast/services/toast-service` | `show(message, type, duration?)` — types: `'success' \| 'danger' \| 'info' \| 'warning'` |
| `PageLoadingService` | `@shared/components/page-loading/services/page-loading-service` | Inject + pass to `loadingObservablePipe` |
| `loadingObservablePipe` | `@shared/observable-pipe/loading-observable-pipe` | `.pipe(loadingObservablePipe(this.pageLoadingService))` on any HTTP observable |
| `EnvironmentService` | `@shared/services/environment-service` | `vendorServiceHost` — already used by `BaseRequestService`; rarely needed directly |
| `IMAGES` | `@shared/constants/images` | Icon paths for table buttons (`IMAGES.EDIT`, `IMAGES.REMOVE`, `IMAGES.NEW`, etc.) |
| `SHOW_ALWAYS` | `@shared/components/table/constants/table-constants` | `show` predicate for table buttons that are always visible |
| `PageLoading` | `@shared/components/page-loading/page-loading` | Add to `imports` in list/form; renders the global loading overlay |
| `Table` | `@shared/components/table/table` | Add to `imports` in list; `[tableConfig]="tableConfig()"` |
| `InputField` | `@shared/components/input-field/input-field` | Add to `imports` in form; generic input with label + validation |

---

## 3. Directory layout

```
src/app/main/features/{group?}/{featureName}/
  interfaces/
    {featureName}-model.ts        ← app-side model
    {featureName}-dto.ts          ← API-side DTO (Portuguese field names)
  services/
    {featureName}-service.ts
    {featureName}-service.spec.ts
  routes/
    {featureName}.routes.ts
    {featureName}-data-all-resolver.ts
    {featureName}-data-id-resolver.ts
  list/
    {featureName}-list.ts
    {featureName}-list.html
    {featureName}-list.scss
    {featureName}-list.spec.ts
  form/
    {featureName}-form.ts
    {featureName}-form.html
    {featureName}-form.scss
    {featureName}-form.spec.ts
```

`{group}` is optional (e.g. `products/`). Top-level features live directly under `features/`.

---

## 4. Interfaces

### `{featureName}-model.ts`
- All fields use **camelCase English** names.
- `id` is always `number | null`.
- Boolean flags use `active: boolean`.

```ts
export interface I{FeatureName}Model {
    id: number | null;
    // ... feature fields
    active: boolean;
}
```

### `{featureName}-dto.ts`
- All fields use **snake_case Portuguese** names (matching the API payload).
- Mirror every field from the model; nullable API fields use `string | null` or `number | null`.

```ts
export interface I{FeatureName}Dto {
    id_{entity}: number | null;
    // ... API field names
    ativo: string;  // 'A' | 'I'
}
```

---

## 5. Service

Extends `BaseRequestService<MODEL, DTO>` from `@shared/services/base-request-service`.

**Mandatory overrides:**
- `basePath` — API path prefix (e.g. `'/tiago/categoria'`).
- `save(model)` — PUT if `model.id` exists, POST otherwise; calls `this.mapDto(model)` then `this.resultObservable()`.
- `getById(id)` — GET `${APIPath}/${id}`; pipes through `map(value => this.mapModel(value.data[0]))`.
- `getAll()` — GET `${APIPath}`; pipes through `map(value => this.mapModels(value.data))`.
- `delete(id)` — DELETE `${APIPath}/${id}`; returns `this.resultObservable()`.
- `mapDto(model)` — maps model → DTO.
- `mapModel(dto)` — maps DTO → model (single record).
- Private `mapModels(data)` — maps DTO[] → model[].

**Pattern:**
```ts
@Injectable({ providedIn: 'root' })
export class {FeatureName}Service extends BaseRequestService<I{FeatureName}Model, I{FeatureName}Dto> {
    override basePath: string = '/tiago/{entity}';

    override save(model: I{FeatureName}Model): Observable<Object> {
        if (model.id) {
            this.request = this.http.put(`${this.APIPath}/${model.id}`, this.mapDto(model));
        } else {
            this.request = this.http.post(`${this.APIPath}`, this.mapDto(model));
        }
        return this.resultObservable();
    }

    override getById(id: number | string): Observable<I{FeatureName}Model> {
        this.request = this.http.get(`${this.APIPath}/${id}`);
        return this.resultObservable().pipe(map((value: any) => this.mapModel(value.data[0])));
    }

    override getAll(): Observable<I{FeatureName}Model[]> {
        this.request = this.http.get(`${this.APIPath}`);
        return this.resultObservable().pipe(map((value: any) => this.mapModels(value.data)));
    }

    override delete(id: number | string): Observable<Object> {
        this.request = this.http.delete(`${this.APIPath}/${id}`);
        return this.resultObservable();
    }

    override mapDto(model: I{FeatureName}Model): I{FeatureName}Dto { /* ... */ }
    override mapModel(dto: I{FeatureName}Dto): I{FeatureName}Model { /* ... */ }
    private mapModels(data: I{FeatureName}Dto[]): I{FeatureName}Model[] {
        return data.map(dto => this.mapModel(dto));
    }
}
```

---

## 6. Routes

### `{featureName}.routes.ts`
```ts
export const {featureName}Routes: Routes = [
    {
        path: 'form',
        loadComponent: () => import('../form/{featureName}-form').then(m => m.{FeatureName}Form),
    },
    {
        path: 'form/:id',
        loadComponent: () => import('../form/{featureName}-form').then(m => m.{FeatureName}Form),
        resolve: { data: {featureName}DataIdResolver },
    },
    {
        path: 'list',
        loadComponent: () => import('../list/{featureName}-list').then(m => m.{FeatureName}List),
        resolve: { data: {featureName}DataAllResolver },
    },
];
```

### `{featureName}-data-all-resolver.ts`
```ts
export const {featureName}DataAllResolver: ResolveFn<any> = (_route, _state) => {
    return inject({FeatureName}Service).getAll();
};
```

### `{featureName}-data-id-resolver.ts`
```ts
export const {featureName}DataIdResolver: ResolveFn<any> = (route, _state) => {
    const service = inject({FeatureName}Service);
    const router = inject(Router);
    const id = route.paramMap.get('id');
    if (id) {
        return service.getById(id);
    } else {
        router.navigateByUrl('/{featureName}/form');
        return EMPTY;
    }
};
```

---

## 7. List component

Extends `BaseList<MODEL, SERVICE>`.

**Key rules:**
- `@Component` decorator: no `standalone: true` (Angular 21 default).
- Imports: `[Table, PageLoading, TranslatePipe]`.
- Inject: `service`, `ToastService`, `PageLoadingService`, `TranslateService`.
- In the constructor: call `this.loadTableConfig()` (which internally calls `loadData()`).
- `title` and `buttonAddTitle`: use i18n keys (e.g. `'MAIN.FEATURES.{FEATURE}.TITLE'`).
- `buttonAddIcon`: `IMAGES.NEW`.
- Override `getTableConfig()`, `onEditAction`, `onRemoveAction`, `onAddAction`.
- `onRemoveAction`: call `service.delete(id)`, pipe through `loadingObservablePipe`, update model signal or call `getAll()`, show toast.
- Navigation uses `this.router.navigate(['{featureName}', 'form', id])`.

**Pattern:**
```ts
@Component({
    selector: 'app-{featureName}-list',
    imports: [Table, PageLoading, TranslatePipe],
    templateUrl: './{featureName}-list.html',
    styleUrl: './{featureName}-list.scss',
})
export class {FeatureName}List extends BaseList<I{FeatureName}Model, {FeatureName}Service> {
    override service = inject({FeatureName}Service);
    private toastService = inject(ToastService);
    private pageLoadingService = inject(PageLoadingService);
    private translate = inject(TranslateService);

    override buttonAddTitle: string = 'MAIN.FEATURES.{FEATURE}.TITLE';
    override buttonAddIcon: string = IMAGES.NEW;

    constructor() {
        super();
        this.title = 'MAIN.FEATURES.{FEATURE}.TITLE';
        this.loadTableConfig();
    }

    public override getTableConfig(): ITableConfig<I{FeatureName}Model> {
        return {
            hasHover: true,
            data: this.model(),
            titles: [ /* columns */ ],
            buttons: [
                { icon: IMAGES.EDIT,   show: SHOW_ALWAYS, name: '', action: d => this.onEditAction(d) },
                { icon: IMAGES.REMOVE, show: SHOW_ALWAYS, name: '', action: d => this.onRemoveAction(d, null) },
            ],
        };
    }

    public override onEditAction = (dataModel: I{FeatureName}Model) => {
        this.router.navigate(['{featureName}', 'form', dataModel.id!]);
    };

    public override onRemoveAction = (dataModel: I{FeatureName}Model, _callback: any) => {
        this.service.delete(dataModel.id!).pipe(loadingObservablePipe(this.pageLoadingService)).subscribe({
            next: () => {
                this.model.update(list => list.filter(i => i.id !== dataModel.id));
                this.toastService.show(this.translate.instant('COMMONS.RECORDREMOVEDWITHSUCCESS'), 'success');
            },
            error: err => this.toastService.show(err.message, 'danger'),
        });
    };

    public override onAddAction = () => {
        this.router.navigate(['{featureName}', 'form']);
    };
}
```

### List HTML template
```html
<app-page-loading></app-page-loading>
<div class="container mt-4">
    <div class="row mb-3 align-items-center">
        <div class="col">
            <h1 class="m-0">{{ 'COMMONS.LISTOF' | translate }}{{ title | translate }}</h1>
        </div>
        <div class="col-auto">
            <button type="button" (click)="onAddAction()" class="btn btn-primary">
                <img src="{{ buttonAddIcon }}" />
                <span>{{ 'COMMONS.ADDRECORD' | translate }}{{ buttonAddTitle | translate }}</span>
            </button>
        </div>
    </div>
    <app-table [tableConfig]="tableConfig()"></app-table>
</div>
```

---

## 8. Form component

Extends `BaseForm<MODEL, SERVICE>`.

**Key rules:**
- `@Component` decorator: no `standalone: true`.
- Imports: `[InputField, TranslatePipe]` (add others as needed, e.g. `FormField`).
- Inject: `service`, `Router`, `ActivatedRoute`, `ToastService`, `TranslateService`.
- In the constructor: call `this.createForm(this.makeEmptyModel(), validations)`.
- In `ngOnInit`: read `this.route.snapshot.data['data']`; if present, call `this.model.set(routeData)`.
- `onSaveAction()`: call `submit(this.formData, async () => { ... })`.
  - Show info toast with save/update message.
  - On success: show success toast, call `this.onCancelAction()`.
  - On error: show danger toast, reset save control.
- `onCancelAction()`: navigate to the list.
- Expose form fields as `get formXxx() { return this.formData.xxx; }`.

**Pattern:**
```ts
@Component({
    selector: 'app-{featureName}-form',
    imports: [InputField, TranslatePipe],
    templateUrl: './{featureName}-form.html',
    styleUrl: './{featureName}-form.scss',
})
export class {FeatureName}Form extends BaseForm<I{FeatureName}Model, {FeatureName}Service> implements OnInit {
    override service = inject({FeatureName}Service);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);
    private translate = inject(TranslateService);

    constructor() {
        super();
        this.createForm(this.makeEmptyModel(), (schemaPath: any) => {
            required(schemaPath.name, { message: 'MAIN.FEATURES.{FEATURE}.VALIDATION.NAMEREQUIRED' });
            minLength(schemaPath.name, 3, { message: 'MAIN.FEATURES.{FEATURE}.VALIDATION.NAMEMINLENGTH' });
        });
    }

    ngOnInit(): void {
        const routeData = this.route.snapshot.data['data'];
        if (routeData) {
            this.model.set(routeData);
        }
    }

    override onSaveAction(): void {
        submit(this.formData, async () => {
            const record = this.model();
            this.updateSaveControl(
                ISateSaveControlModel.SAVING,
                record.id == null
                    ? this.translate.instant('COMMONS.SAVING')
                    : this.translate.instant('COMMONS.UPDATING')
            );
            this.toastService.show(this.saveControl().message, 'info');
            this.service.save(record).subscribe({
                next: () => {
                    this.toastService.show(this.translate.instant('COMMONS.RECORDSAVEDWITHSUCCESS'), 'success', 1000);
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.onCancelAction();
                },
                error: () => {
                    this.toastService.show(this.translate.instant('COMMONS.FAILSTOSAVERECORD'), 'danger');
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                },
            });
        });
    }

    override onCancelAction(): void {
        this.router.navigate(['{featureName}', 'list']);
    }

    private makeEmptyModel(): I{FeatureName}Model {
        return { id: null, /* fields with defaults */, active: true };
    }

    get formName() { return this.formData.name; }
    // ... other field getters
}
```

---

## 9. Spec files (.spec.ts)

Minimal smoke test — just verify the component/service can be instantiated:

```ts
// list or form:
describe('{FeatureName}List', () => {
    let component: {FeatureName}List;
    let fixture: ComponentFixture<{FeatureName}List>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [{FeatureName}List] }).compileComponents();
        fixture = TestBed.createComponent({FeatureName}List);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => expect(component).toBeTruthy());
});

// service:
describe('{FeatureName}Service', () => {
    let service: {FeatureName}Service;
    beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject({FeatureName}Service); });
    it('should be created', () => expect(service).toBeTruthy());
});
```

---

## 10. i18n keys

Add under `MAIN.FEATURES.{FEATURE_UPPER}` in `$PWD/src/assets/i18n/pt-BR.json`:

```json
"MAIN": {
  "FEATURES": {
    "{FEATURE_UPPER}": {
      "TITLE": "...",
      "VALIDATION": {
        "NAMEREQUIRED": "...",
        "NAMEMINLENGTH": "..."
      }
    }
  }
}
```

Common keys (already exist in the file, do not duplicate):
- `COMMONS.LISTOF`, `COMMONS.ADDRECORD`
- `COMMONS.SAVING`, `COMMONS.UPDATING`
- `COMMONS.RECORDSAVEDWITHSUCCESS`, `COMMONS.FAILSTOSAVERECORD`
- `COMMONS.RECORDREMOVEDWITHSUCCESS`

---

## 11. App routing registration

In `$PWD/src/app/app.routes.ts`, add inside the `children` array of the root `''` route:

```ts
{
    path: '{featureName}',
    loadChildren: () =>
        import('./main/features/{group?}/{featureName}/routes/{featureName}.routes')
            .then(m => m.{featureName}Routes),
},
```

---

## Naming conventions

| Concept | Convention | Example |
|---|---|---|
| Feature folder | kebab-case | `product-unit` |
| Route segment | kebab-case | `product-unit` |
| Class name | PascalCase | `ProductUnit` |
| File name | kebab-case | `product-unit-form.ts` |
| Interface | `I{Name}Model` / `I{Name}Dto` | `IProductUnitModel` |
| Service | `{Name}Service` | `ProductUnitService` |
| Routes export | `{camelName}Routes` | `productUnitRoutes` |
| i18n namespace | SCREAMING_SNAKE_CASE | `PRODUCT_UNIT` |
