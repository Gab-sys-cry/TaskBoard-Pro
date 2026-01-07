import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { TaskService } from '../services/task.service';
import { NotificationService } from '../core/services/notification.service';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { provideRouter } from '@angular/router';

/**
 * Tests unitaires pour HomeComponent
 * Utilise des mocks pour isoler le composant
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let taskServiceMock: Partial<TaskService>;

  // Données de test
  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, priority: 'high', createdAt: new Date() },
    { id: 2, title: 'Task 2', description: 'Desc 2', completed: true, priority: 'medium', createdAt: new Date() },
    { id: 3, title: 'Task 3', description: 'Desc 3', completed: false, priority: 'low', createdAt: new Date() }
  ];

  beforeEach(async () => {
    // Création des BehaviorSubjects pour simuler les Observables du service
    const tasksSubject = new BehaviorSubject<Task[]>(mockTasks);

    taskServiceMock = {
      tasks$: tasksSubject.asObservable(),
      totalTasks$: new BehaviorSubject<number>(3).asObservable(),
      completedCount$: new BehaviorSubject<number>(1).asObservable(),
      pendingCount$: new BehaviorSubject<number>(2).asObservable(),
      progressPercentage$: new BehaviorSubject<number>(33).asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: NotificationService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir un titre', () => {
      expect(component.title).toBeDefined();
      expect(component.title).toContain('TaskBoard Pro');
    });
  });

  // ==================== Tests des Observables ====================

  describe('Observables', () => {
    it('devrait avoir totalTasks$ défini', () => {
      expect(component.totalTasks$).toBeDefined();
    });

    it('devrait avoir completedCount$ défini', () => {
      expect(component.completedCount$).toBeDefined();
    });

    it('devrait avoir pendingCount$ défini', () => {
      expect(component.pendingCount$).toBeDefined();
    });

    it('devrait avoir progressPercentage$ défini', () => {
      expect(component.progressPercentage$).toBeDefined();
    });
  });

  // ==================== Tests du rendu ====================

  describe('Rendu du template', () => {
    it('devrait afficher le titre dans le template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('TaskBoard Pro');
    });

    it('devrait afficher les statistiques', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const statBoxes = compiled.querySelectorAll('.stat-box');

      expect(statBoxes.length).toBeGreaterThan(0);
    });

    it('devrait avoir un lien vers la page tasks', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaLink = compiled.querySelector('.cta-btn');

      expect(ctaLink).toBeTruthy();
    });

    it('devrait afficher les feature cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const featureCards = compiled.querySelectorAll('.feature-card');

      expect(featureCards.length).toBe(3);
    });
  });
});

