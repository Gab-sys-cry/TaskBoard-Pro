# 📋 TaskBoard Pro - Documentation Technique

### 1. Service TaskService (`src/app/services/task.service.ts`)

Un service Angular utilisant **RxJS** pour gérer un flux réactif de données (tâches).

#### Concepts clés implémentés :

| Concept             | Description                                                                     |
|---------------------|---------------------------------------------------------------------------------|
| **BehaviorSubject** | Stocke l'état actuel des tâches et émet la dernière valeur aux nouveaux abonnés |
| **Observable**      | Flux de données en lecture seule exposé aux composants                          |
| **Opérateur `map`** | Transforme les données pour créer des Observables dérivés                       |
| **Async Pipe**      | Gère automatiquement les subscriptions/unsubscriptions dans les templates       |

---

### 2. Lazy Loading avec `loadChildren()`

Le routing utilise le **lazy loading** pour charger les modules à la demande.

#### Configuration dans `app.routes.ts` :

```typescript
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.routes').then(m => m.TASKS_ROUTES)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.routes').then(m => m.ABOUT_ROUTES)
  }
];
```

#### Fichiers de routes par feature :

Chaque feature a son propre fichier de routes qui utilise `loadComponent()` :

```typescript
// home/home.routes.ts
export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home').then(m => m.HomeComponent)
  }
];
```
---

### 🔄 Observables disponibles dans TaskService

```typescript
// Observable principal
tasks$: Observable<Task[]>              // Liste complète des tâches

// Observables dérivés (calculés automatiquement)
totalTasks$: Observable<number>         // Nombre total de tâches
completedTasks$: Observable<Task[]>     // Tâches terminées
pendingTasks$: Observable<Task[]>       // Tâches en cours
completedCount$: Observable<number>     // Nombre de tâches terminées
pendingCount$: Observable<number>       // Nombre de tâches en cours
progressPercentage$: Observable<number> // Pourcentage de progression
```

---

### 🛠️ Méthodes du service

| Méthode                    | Description                          |
|----------------------------|--------------------------------------|
| `addTask(task)`            | Ajoute une nouvelle tâche            |
| `deleteTask(id)`           | Supprime une tâche par son ID        |
| `toggleTaskCompletion(id)` | Bascule l'état complété/non complété |
| `updateTask(id, updates)`  | Met à jour une tâche existante       |
| `getTaskById(id)`          | Retourne un Observable de la tâche   |

---

### 📱 Utilisation dans les composants

#### Dans le composant TypeScript :

```typescript
// Injection du service
private
taskService = inject(TaskService);

// Exposer les Observables pour le template
tasks$ = this.taskService.tasks$;
totalTasks$ = this.taskService.totalTasks$;
```

#### Dans le template HTML avec async pipe :

```html
<!-- Affichage réactif avec async pipe -->
<span>{{ totalTasks$ | async }} tâches</span>

<!-- Boucle sur les tâches -->
@for (task of tasks$ | async; track task.id) {
<div>{{ task.title }}</div>
}
```

---

### ✨ Avantages de cette approche

1. **Réactivité** : Les données se mettent à jour automatiquement dans tous les composants
2. **Pas de memory leaks** : L'async pipe gère les unsubscriptions automatiquement
3. **État partagé** : Le même état est accessible depuis Home et About
4. **Immutabilité** : Les tâches sont modifiées de manière immutable avec le spread operator
5. **Séparation des responsabilités** : La logique métier est dans le service, pas dans les composants

---

### 🔗 Flux de données

```
┌─────────────────┐
│  TaskService    │
│  ┌───────────┐  │
│  │BehaviorSub│──┼──► tasks$ ──► HomeComponent (async pipe)
│  │   ject    │  │         └──► AboutComponent (async pipe)
│  └───────────┘  │
└─────────────────┘
        ▲
        │ addTask(), deleteTask(), toggleTaskCompletion()
        │
┌───────┴─────────┐
│  User Actions   │
│  (clicks, form) │
└─────────────────┘
```

---

## 📝 Notes techniques

- **Angular 20** : Utilisation des nouvelles syntaxes `@for` et `@empty`
- **Standalone components** : Pas besoin de NgModule
- **inject()** : Nouvelle façon d'injecter les dépendances
- **CommonModule** : Importé pour utiliser le pipe `async` et `date`

