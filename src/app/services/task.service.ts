import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, skip, tap} from 'rxjs';
import {Task} from '../models/task.model';
import {NotificationService} from '../core/services/notification.service';
import {SecurityService} from '../core/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Observable dérivé : nombre total de tâches
  totalTasks$: Observable<number> = this.tasks$.pipe(
    map(tasks => tasks.length)
  );
  // Observable dérivé : taches complétées
  completedTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.completed))
  );
  // Observable dérivé : tâches en cours
  pendingTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => !task.completed))
  );
  // Données initiales par défaut
  // Observable dérivé : nombre de tâches complétées
  completedCount$: Observable<number> = this.completedTasks$.pipe(
    map(tasks => tasks.length)
  );
  // Observable dérivé : nombre de tâches en cours
  pendingCount$: Observable<number> = this.pendingTasks$.pipe(
    map(tasks => tasks.length)
  );
  // Observable dérivé : pourcentage de progression
  progressPercentage$: Observable<number> = this.tasks$.pipe(
    map(tasks => {
      if (tasks.length === 0) return 0;
      const completed = tasks.filter(t => t.completed).length;
      return Math.round((completed / tasks.length) * 100);
    })
  );
  private notificationService = inject(NotificationService);
  private securityService = inject(SecurityService);
  private readonly STORAGE_KEY = 'taskboard-pro-tasks';
  // Création de quelques taches initiales pour la démo
  private readonly defaultTasks: Task[] = [
    {
      id: 1,
      title: 'Apprendre Angular',
      description: 'Maîtriser les concepts fondamentaux d\'Angular 20',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Configurer le routing',
      description: 'Mettre en place la navigation entre les pages',
      completed: true,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'Créer les composants',
      description: 'Développer Header, Footer, Home et About',
      completed: true,
      priority: 'medium',
      createdAt: new Date()
    },
    {
      id: 4,
      title: 'Implémenter RxJS',
      description: 'Utiliser les Observables pour la gestion des données',
      completed: false,
      priority: 'high',
      createdAt: new Date()
    },
    {
      id: 5,
      title: 'Ajouter des tests',
      description: 'Écrire des tests unitaires pour les services',
      completed: false,
      priority: 'low',
      createdAt: new Date()
    }
  ];
  // BehaviorSubject pour maintenir l'état des taches
  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasksFromStorage());
  // Observable
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    // Sauvegarder automatiquement les tâches à chaque changement
    skip(1);
    this.tasks$.subscribe(tasks => this.saveTasksToStorage(tasks));
  }

  // Réinitialiser les taches aux valeurs par défaut
  resetToDefaultTasks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.tasksSubject.next(this.defaultTasks);
    this.notificationService.info('Tâches réinitialisées aux valeurs par défaut');
  }

  // Exporter les taches en JSON
  exportTasksToJson(): string {
    return JSON.stringify(this.tasksSubject.getValue(), null, 2);
  }

  // Importer des taches depuis un JSON
  importTasksFromJson(jsonString: string): boolean {
    try {
      const tasks: Task[] = JSON.parse(jsonString);
      const validatedTasks = tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      this.tasksSubject.next(validatedTasks);
      this.notificationService.success('Tâches importées avec succès');
      return true;
    } catch (error) {
      this.notificationService.error('Erreur lors de l\'importation des tâches');
      return false;
    }
  }

  // Ajouter une nouvelle tache
  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    // Validation de sécurité - Protection XSS
    const sanitizedTitle = this.securityService.validateTaskTitle(task.title);
    if (!sanitizedTitle) {
      this.notificationService.error('Titre de tâche invalide');
      return;
    }

    // Vérifier les tentatives d'injection
    if (this.securityService.containsMaliciousHtml(task.title) ||
      this.securityService.containsMaliciousHtml(task.description)) {
      this.securityService.logSecurityWarning(task.title, 'task title/description');
      this.notificationService.warning('Contenu potentiellement dangereux détecté et nettoyé');
    }

    const sanitizedDescription = this.securityService.validateTaskDescription(task.description);

    const currentTasks = this.tasksSubject.getValue();
    const newTask: Task = {
      ...task, // permet de copier completed et priority
      title: sanitizedTitle,
      description: sanitizedDescription,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.tasksSubject.next([...currentTasks, newTask]); // Ajout de la nouvelle tache

    // Notification avec tap()
    this.tasks$.pipe(
      tap(() => console.log(`[TaskService] Tâche ajoutée: ${newTask.title}`))
    ).subscribe().unsubscribe();

    this.notificationService.success(`Tâche "${newTask.title}" ajoutée !`);
  }

  // Supprimer une tache
  deleteTask(id: number): void {
    const currentTasks = this.tasksSubject.getValue();
    const taskToDelete = currentTasks.find(t => t.id === id);
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);

    // Notification avec tap()
    this.tasks$.pipe(
      tap(() => console.log(`[TaskService] Tâche supprimée: ID ${id}`))
    ).subscribe().unsubscribe();

    if (taskToDelete) {
      this.notificationService.error(`Tâche "${taskToDelete.title}" supprimée`);
    }
  }

  // Basculer l'état complété d'une tache
  toggleTaskCompletion(id: number): void {
    const currentTasks = this.tasksSubject.getValue();
    const task = currentTasks.find(t => t.id === id);
    const updatedTasks = currentTasks.map(t =>
      t.id === id ? {...t, completed: !t.completed} : t
    );
    this.tasksSubject.next(updatedTasks);

    // Notification avec tap()
    this.tasks$.pipe(
      tap(() => console.log(`[TaskService] Tâche basculée: ID ${id}`))
    ).subscribe().unsubscribe();

    if (task) {
      const status = !task.completed ? 'terminée' : 'réouverte';
      this.notificationService.info(`Tâche "${task.title}" ${status}`);
    }
  }

  // Mettre à jour une tache
  updateTask(id: number, updates: Partial<Task>): void {
    // Validation de sécurité pour les mises à jour
    const sanitizedUpdates: Partial<Task> = {...updates};

    if (updates.title !== undefined) {
      const sanitizedTitle = this.securityService.validateTaskTitle(updates.title);
      if (!sanitizedTitle) {
        this.notificationService.error('Titre de tâche invalide');
        return;
      }
      if (this.securityService.containsMaliciousHtml(updates.title)) {
        this.securityService.logSecurityWarning(updates.title, 'task update title');
        this.notificationService.warning('Contenu dangereux détecté et nettoyé');
      }
      sanitizedUpdates.title = sanitizedTitle;
    }

    if (updates.description !== undefined) {
      if (this.securityService.containsMaliciousHtml(updates.description)) {
        this.securityService.logSecurityWarning(updates.description, 'task update description');
      }
      sanitizedUpdates.description = this.securityService.validateTaskDescription(updates.description);
    }

    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task =>
      task.id === id ? {...task, ...sanitizedUpdates} : task
    );
    this.tasksSubject.next(updatedTasks);

    // Notification avec tap()
    this.tasks$.pipe(
      tap(() => console.log(`[TaskService] Tâche mise à jour: ID ${id}`))
    ).subscribe().unsubscribe();

    this.notificationService.success(`Tâche modifiée avec succès !`);
  }

  // Obtenir une tache par ID
  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  // Charger les taches depuis le localStorage
  private loadTasksFromStorage(): Task[] {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const tasks: Task[] = JSON.parse(storedData);
        return tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
      }
    } catch (error) {
      console.error('[TaskService] Erreur lors du chargement des tâches:', error);
    }
    // Retourner les taches par défaut si aucune donnée n'est trouvée
    return this.defaultTasks;
  }

  // Sauvegarder les taches dans le localStorage
  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('[TaskService] Erreur lors de la sauvegarde des tâches:', error);
    }
  }

  // Générer un ID unique
  private generateId(): number {
    const currentTasks = this.tasksSubject.getValue();
    return currentTasks.length > 0
      ? Math.max(...currentTasks.map(t => t.id)) + 1
      : 1;
  }
}

