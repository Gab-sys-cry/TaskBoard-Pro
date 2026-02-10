# TaskBoardPro

### Qu'est-ce que le Lazy Loading ?

Le **Lazy Loading** (chargement paresseux) est une technique d'optimisation qui consiste à charger les modules/composants uniquement quand l'utilisateur en a besoin, plutôt que de tout charger au démarrage de l'application.

**Avantages :**

- Temps de chargement initial réduit
- Bundles JavaScript séparés par feature
- Meilleure expérience utilisateur

**Implémentation avec `loadChildren()` :**

```typescript
// app.routes.ts
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

## Coverage

![Coverage Report](./docs/coverage.png)

### Qu'est-ce qu'un composant dynamique ?

Un **composant dynamique** est un composant qui n'est pas déclaré dans le template HTML, mais créé programmatiquement à l'exécution (runtime). Cela permet de :

- Afficher des modales/popups à la demande
- Créer des interfaces configurables
- Charger des composants selon des conditions

**Exemples dans ce projet :**

- `TaskHighlightComponent` : Affiche une tâche mise en avant
- `TaskEditComponent` : Formulaire d'édition de tâche

### Comment fonctionne ViewContainerRef + createComponent()

**ViewContainerRef** est une référence à un conteneur dans le DOM où on peut injecter des composants dynamiquement.

```typescript
// 1. Déclarer le conteneur dans le template
<ng-container
#dynamicComponentContainer > </ng-container>

// 2. Récupérer la référence avec @ViewChild
@ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
dynamicContainer!
:
ViewContainerRef;

// 3. Créer le composant dynamiquement
highlightTask(task
:
Task
):
void {
  // Nettoyer le conteneur
  this.dynamicContainer.clear();

  // Créer le composant
  const componentRef = this.dynamicContainer.createComponent(TaskHighlightComponent);

  // Passer des données au composant
  componentRef.instance.task = task;

  // S'abonner aux événements
  componentRef.instance.close.subscribe(() => {
    componentRef.destroy();
  });
}
```

**Cycle de vie :**

1. `createComponent()` instancie le composant
2. Les `@Input()` sont assignés via `.instance`
3. Les `@Output()` sont écoutés via `.subscribe()`
4. `destroy()` supprime le composant

### Notifications avec tap()

L'opérateur `tap()` de RxJS permet d'observer un flux **sans le modifier**. Idéal pour :

- Logger des actions
- Déclencher des effets secondaires
- Afficher des notifications

```typescript
// Dans TaskService
addTask(task)
:
void {
  // ... logique d'ajout ...

  // Observer avec tap() sans modifier le flux
  this.tasks$.pipe(
    tap(() => console.log('[TaskService] Tâche ajoutée'))
  ).subscribe().unsubscribe();

  // Afficher notification
  this.notificationService.success('Tâche ajoutée !');
}
```

D'autres markdown sont disponibles en parcourant l'arborescence du projet ! 
