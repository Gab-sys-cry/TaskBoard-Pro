import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TasksComponent} from './tasks';
import {TaskService} from '../services/task.service';
import {NotificationService} from '../core/services/notification.service';
import {BehaviorSubject} from 'rxjs';
import {Task} from '../models/task.model';
import {beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * Tests unitaires pour TasksComponent
 * Test des fonctionnalités CRUD et des composants dynamiques
 */
describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskServiceMock: any;

  // Données de test
  const mockTasks: Task[] = [
    {id: 1, title: 'Task 1', description: 'Description 1', completed: false, priority: 'high', createdAt: new Date()},
    {id: 2, title: 'Task 2', description: 'Description 2', completed: true, priority: 'medium', createdAt: new Date()},
    {id: 3, title: 'Task 3', description: 'Description 3', completed: false, priority: 'low', createdAt: new Date()}
  ];

  const tasksSubject = new BehaviorSubject<Task[]>(mockTasks);
  const completedSubject = new BehaviorSubject<Task[]>(mockTasks.filter(t => t.completed));
  const pendingSubject = new BehaviorSubject<Task[]>(mockTasks.filter(t => !t.completed));

  beforeEach(async () => {
    // Mock du TaskService avec Vitest
    taskServiceMock = {
      addTask: vi.fn(),
      deleteTask: vi.fn(),
      toggleTaskCompletion: vi.fn(),
      updateTask: vi.fn(),
      tasks$: tasksSubject.asObservable(),
      totalTasks$: new BehaviorSubject<number>(3).asObservable(),
      completedCount$: new BehaviorSubject<number>(1).asObservable(),
      pendingCount$: new BehaviorSubject<number>(2).asObservable(),
      progressPercentage$: new BehaviorSubject<number>(33).asObservable(),
      completedTasks$: completedSubject.asObservable(),
      pendingTasks$: pendingSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        {provide: TaskService, useValue: taskServiceMock},
        {provide: NotificationService, useValue: {}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir un titre', () => {
      expect(component.title).toBe('Gestion des Tâches');
    });
  });

  // ==================== Tests des Observables ====================

  describe('Observables', () => {
    it('devrait avoir tasks$ défini', () => {
      expect(component.tasks$).toBeDefined();
    });

    it('devrait avoir completedTasks$ défini', () => {
      expect(component.completedTasks$).toBeDefined();
    });

    it('devrait avoir pendingTasks$ défini', () => {
      expect(component.pendingTasks$).toBeDefined();
    });
  });

  // ==================== Tests des méthodes ====================

  describe('Méthode toggleTask()', () => {
    it('devrait appeler taskService.toggleTaskCompletion avec l\'ID', () => {
      component.toggleTask(1);
      expect(taskServiceMock.toggleTaskCompletion).toHaveBeenCalledWith(1);
    });
  });

  describe('Méthode deleteTask()', () => {
    it('devrait appeler taskService.deleteTask avec l\'ID', () => {
      component.deleteTask(1);
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(1);
    });
  });

  describe('Méthode addTask()', () => {
    it('devrait appeler taskService.addTask avec les bonnes données', () => {
      component.addTask('Nouvelle tâche', 'Description', 'high');

      expect(taskServiceMock.addTask).toHaveBeenCalledWith({
        title: 'Nouvelle tâche',
        description: 'Description',
        completed: false,
        priority: 'high'
      });
    });

    it('ne devrait pas ajouter si le titre est vide', () => {
      component.addTask('', 'Description', 'medium');
      expect(taskServiceMock.addTask).not.toHaveBeenCalled();
    });

    it('ne devrait pas ajouter si le titre ne contient que des espaces', () => {
      component.addTask('   ', 'Description', 'medium');
      expect(taskServiceMock.addTask).not.toHaveBeenCalled();
    });
  });

  // ==================== Tests du rendu ====================

  describe('Rendu du template', () => {
    it('devrait afficher le titre', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Gestion des Tâches');
    });

    it('devrait afficher les statistiques', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const statCards = compiled.querySelectorAll('.stat-card');

      expect(statCards.length).toBe(4);
    });

    it('devrait afficher le formulaire d\'ajout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('.add-task-form');

      expect(form).toBeTruthy();
    });

    it('devrait afficher les deux colonnes de tâches', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const columns = compiled.querySelectorAll('.tasks-column');

      expect(columns.length).toBe(2);
    });
  });

  // ==================== Tests des composants dynamiques ====================

  describe('Composants dynamiques', () => {
    it('devrait avoir la méthode highlightTask', () => {
      expect(component.highlightTask).toBeDefined();
      expect(typeof component.highlightTask).toBe('function');
    });

    it('devrait avoir la méthode editTask', () => {
      expect(component.editTask).toBeDefined();
      expect(typeof component.editTask).toBe('function');
    });
  });
});

