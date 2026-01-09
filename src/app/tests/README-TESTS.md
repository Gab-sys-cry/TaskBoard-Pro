# Tests Unitaires - TaskBoard Pro

## Vue d'ensemble

Ce document explique la configuration et l'utilisation des tests unitaires dans l'application TaskBoard Pro.

## Framework de test

L'application utilise **Vitest** (compatible avec l'API Jasmine) comme framework de test, avec **TestBed** d'Angular pour la configuration.

## Commandes

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm test -- --watch

# Lancer les tests avec coverage
npm test -- --coverage
```

## Concepts clés

### 1. TestBed

`TestBed` est l'utilitaire principal pour configurer un environnement de test Angular.

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MonComposant],        // Composants standalone à tester
    providers: [                     // Services et mocks
      { provide: MonService, useValue: mockService }
    ]
  }).compileComponents();
});
```

### 2. Mocking des services

Pour isoler les tests, on crée des mocks des services :

```typescript
// Mock simple avec des valeurs
const taskServiceMock = {
  tasks$: new BehaviorSubject<Task[]>([]).asObservable(),
  addTask: () => {
  }
};

// Mock avec Jasmine Spy
const taskServiceMock = jasmine.createSpyObj('TaskService', [
  'addTask',
  'deleteTask',
  'toggleTaskCompletion'
]);
```

### 3. Fixture et ComponentInstance

```typescript
let component: MonComponent;
let fixture: ComponentFixture<MonComponent>;

beforeEach(() => {
  fixture = TestBed.createComponent(MonComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();  // Déclenche la détection de changements
});
```

### 4. Tests asynchrones avec Observables

```typescript
import { firstValueFrom } from 'rxjs';

it('devrait retourner les tâches', async () => {
  const tasks = await firstValueFrom(service.tasks$);
  expect(tasks.length).toBeGreaterThan(0);
});
```

### 5. Tests du DOM

```typescript
it('devrait afficher le titre', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('h1')?.textContent).toContain('Mon Titre');
});
```

## Types de tests

### Tests de Service

| Test               | Description                            |
|--------------------|----------------------------------------|
| Création           | Vérifie que le service est créé        |
| Observables        | Vérifie les flux de données            |
| Méthodes CRUD      | Vérifie les opérations sur les données |
| Effets secondaires | Vérifie les appels aux autres services |

### Tests de Composant

| Test           | Description                            |
|----------------|----------------------------------------|
| Création       | Vérifie que le composant est créé      |
| @Input/@Output | Vérifie les propriétés d'entrée/sortie |
| Rendu          | Vérifie le contenu HTML généré         |
| Événements     | Vérifie les interactions utilisateur   |
| Classes CSS    | Vérifie les classes appliquées         |

## Coverage

Le code coverage mesure le pourcentage de code testé :

- **Statements** : Lignes de code exécutées
- **Branches** : Conditions (if/else) testées
- **Functions** : Fonctions appelées
- **Lines** : Lignes couvertes

```bash
# Générer le rapport de coverage
npm test -- --coverage
```

