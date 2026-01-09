import {TestBed} from '@angular/core/testing';
import {TaskService} from './task.service';
import {NotificationService} from '../core/services/notification.service';
import {firstValueFrom} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * Tests unitaires pour TaskService
 * Utilise TestBed pour configurer l'environnement de test Angular
 * Mock du NotificationService pour isoler les tests
 */
describe('TaskService', () => {
  let service: TaskService;
  let notificationServiceMock: any;

  beforeEach(() => {
    // Création d'un mock pour NotificationService avec Vitest
    notificationServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      show: vi.fn(),
      dismiss: vi.fn()
    };

    // Configuration du TestBed avec le mock
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        {provide: NotificationService, useValue: notificationServiceMock}
      ]
    });

    service = TestBed.inject(TaskService);
  });

  // ==================== Tests de création ====================

  describe('Création du service', () => {
    it('devrait créer le service', () => {
      expect(service).toBeTruthy();
    });

    it('devrait avoir des tâches initiales', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  // ==================== Tests des Observables ====================

  describe('Observables', () => {
    it('tasks$ devrait émettre la liste des tâches', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('totalTasks$ devrait retourner le nombre total de tâches', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const total = await firstValueFrom(service.totalTasks$);
      expect(total).toBe(tasks.length);
    });

    it('completedTasks$ devrait filtrer les tâches complétées', async () => {
      const completed = await firstValueFrom(service.completedTasks$);
      expect(completed.every(t => t.completed)).toBe(true);
    });

    it('pendingTasks$ devrait filtrer les tâches non complétées', async () => {
      const pending = await firstValueFrom(service.pendingTasks$);
      expect(pending.every(t => !t.completed)).toBe(true);
    });

    it('completedCount$ devrait compter les tâches complétées', async () => {
      const completedTasks = await firstValueFrom(service.completedTasks$);
      const count = await firstValueFrom(service.completedCount$);
      expect(count).toBe(completedTasks.length);
    });

    it('pendingCount$ devrait compter les tâches en cours', async () => {
      const pendingTasks = await firstValueFrom(service.pendingTasks$);
      const count = await firstValueFrom(service.pendingCount$);
      expect(count).toBe(pendingTasks.length);
    });

    it('progressPercentage$ devrait calculer le pourcentage de progression', async () => {
      const total = await firstValueFrom(service.totalTasks$);
      const completed = await firstValueFrom(service.completedCount$);
      const percentage = await firstValueFrom(service.progressPercentage$);

      const expectedPercentage = Math.round((completed / total) * 100);
      expect(percentage).toBe(expectedPercentage);
    });
  });

  // ==================== Tests d'ajout de tâche ====================

  describe('addTask', () => {
    it('devrait ajouter une nouvelle tâche', async () => {
      const initialTasks = await firstValueFrom(service.tasks$);
      const initialCount = initialTasks.length;

      service.addTask({
        title: 'Nouvelle tâche test',
        description: 'Description test',
        completed: false,
        priority: 'medium'
      });

      const updatedTasks = await firstValueFrom(service.tasks$);
      expect(updatedTasks.length).toBe(initialCount + 1);
    });

    it('devrait assigner un ID unique à la nouvelle tâche', async () => {
      service.addTask({
        title: 'Tâche avec ID',
        description: 'Test ID',
        completed: false,
        priority: 'high'
      });

      const tasks = await firstValueFrom(service.tasks$);
      const newTask = tasks.find(t => t.title === 'Tâche avec ID');

      expect(newTask).toBeTruthy();
      expect(newTask?.id).toBeDefined();
      expect(typeof newTask?.id).toBe('number');
    });

    it('devrait assigner une date de création', async () => {
      service.addTask({
        title: 'Tâche avec date',
        description: 'Test date',
        completed: false,
        priority: 'low'
      });

      const tasks = await firstValueFrom(service.tasks$);
      const newTask = tasks.find(t => t.title === 'Tâche avec date');

      expect(newTask?.createdAt).toBeDefined();
      expect(newTask?.createdAt instanceof Date).toBe(true);
    });

    it('devrait appeler notificationService.success', () => {
      service.addTask({
        title: 'Test notification',
        description: 'Test',
        completed: false,
        priority: 'medium'
      });

      expect(notificationServiceMock.success).toHaveBeenCalled();
    });
  });

  // ==================== Tests de suppression de tâche ====================

  describe('deleteTask', () => {
    it('devrait supprimer une tâche existante', async () => {
      const initialTasks = await firstValueFrom(service.tasks$);
      const taskToDelete = initialTasks[0];
      const initialCount = initialTasks.length;

      service.deleteTask(taskToDelete.id);

      const updatedTasks = await firstValueFrom(service.tasks$);
      expect(updatedTasks.length).toBe(initialCount - 1);
      expect(updatedTasks.find(t => t.id === taskToDelete.id)).toBeUndefined();
    });

    it('devrait appeler notificationService.error pour la suppression', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const taskToDelete = tasks[0];

      service.deleteTask(taskToDelete.id);

      expect(notificationServiceMock.error).toHaveBeenCalled();
    });

    it('ne devrait rien faire si l\'ID n\'existe pas', async () => {
      const initialTasks = await firstValueFrom(service.tasks$);
      const initialCount = initialTasks.length;

      service.deleteTask(99999);

      const updatedTasks = await firstValueFrom(service.tasks$);
      expect(updatedTasks.length).toBe(initialCount);
    });
  });

  // ==================== Tests de basculement de statut ====================

  describe('toggleTaskCompletion', () => {
    it('devrait basculer une tâche non complétée vers complétée', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const pendingTask = tasks.find(t => !t.completed);

      if (pendingTask) {
        service.toggleTaskCompletion(pendingTask.id);

        const updatedTasks = await firstValueFrom(service.tasks$);
        const updatedTask = updatedTasks.find(t => t.id === pendingTask.id);

        expect(updatedTask?.completed).toBe(true);
      }
    });

    it('devrait basculer une tâche complétée vers non complétée', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const completedTask = tasks.find(t => t.completed);

      if (completedTask) {
        service.toggleTaskCompletion(completedTask.id);

        const updatedTasks = await firstValueFrom(service.tasks$);
        const updatedTask = updatedTasks.find(t => t.id === completedTask.id);

        expect(updatedTask?.completed).toBe(false);
      }
    });

    it('devrait appeler notificationService.info', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const task = tasks[0];

      service.toggleTaskCompletion(task.id);

      expect(notificationServiceMock.info).toHaveBeenCalled();
    });
  });

  // ==================== Tests de mise à jour de tâche ====================

  describe('updateTask', () => {
    it('devrait mettre à jour le titre d\'une tâche', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const taskToUpdate = tasks[0];
      const newTitle = 'Titre modifié';

      service.updateTask(taskToUpdate.id, {title: newTitle});

      const updatedTasks = await firstValueFrom(service.tasks$);
      const updatedTask = updatedTasks.find(t => t.id === taskToUpdate.id);

      expect(updatedTask?.title).toBe(newTitle);
    });

    it('devrait mettre à jour plusieurs propriétés', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const taskToUpdate = tasks[0];

      service.updateTask(taskToUpdate.id, {
        title: 'Nouveau titre',
        description: 'Nouvelle description',
        priority: 'high'
      });

      const updatedTasks = await firstValueFrom(service.tasks$);
      const updatedTask = updatedTasks.find(t => t.id === taskToUpdate.id);

      expect(updatedTask?.title).toBe('Nouveau titre');
      expect(updatedTask?.description).toBe('Nouvelle description');
      expect(updatedTask?.priority).toBe('high');
    });

    it('devrait appeler notificationService.success', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const task = tasks[0];

      service.updateTask(task.id, {title: 'Test'});

      expect(notificationServiceMock.success).toHaveBeenCalled();
    });
  });

  // ==================== Tests de getTaskById ====================

  describe('getTaskById', () => {
    it('devrait retourner une tâche par son ID', async () => {
      const tasks = await firstValueFrom(service.tasks$);
      const expectedTask = tasks[0];

      const foundTask = await firstValueFrom(service.getTaskById(expectedTask.id));

      expect(foundTask).toBeDefined();
      expect(foundTask?.id).toBe(expectedTask.id);
      expect(foundTask?.title).toBe(expectedTask.title);
    });

    it('devrait retourner undefined pour un ID inexistant', async () => {
      const foundTask = await firstValueFrom(service.getTaskById(99999));
      expect(foundTask).toBeUndefined();
    });
  });
});

