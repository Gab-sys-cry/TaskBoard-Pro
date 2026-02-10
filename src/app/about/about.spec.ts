import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AboutComponent} from './about';
import {TaskService} from '../services/task.service';
import {NotificationService} from '../core/services/notification.service';
import {BehaviorSubject} from 'rxjs';
import {beforeEach, describe, expect, it} from 'vitest';

/**
 * Tests unitaires pour AboutComponent
 */
describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let taskServiceMock: Partial<TaskService>;

  beforeEach(async () => {
    taskServiceMock = {
      totalTasks$: new BehaviorSubject<number>(5).asObservable(),
      completedCount$: new BehaviorSubject<number>(2).asObservable(),
      pendingCount$: new BehaviorSubject<number>(3).asObservable(),
      progressPercentage$: new BehaviorSubject<number>(40).asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        {provide: TaskService, useValue: taskServiceMock},
        {provide: NotificationService, useValue: {}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir un titre défini', () => {
      expect(component.title).toBeDefined();
    });
  });

  // ==================== Tests du rendu ====================

  describe('Rendu du template', () => {
    it('devrait afficher le titre', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toBeTruthy();
    });

    it('devrait afficher les cards glass', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const glassCards = compiled.querySelectorAll('.glass-card');

      expect(glassCards.length).toBeGreaterThan(0);
    });

    it('devrait afficher les statistiques', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const statItems = compiled.querySelectorAll('.stat-item');

      expect(statItems.length).toBe(4);
    });

    it('devrait afficher la liste des fonctionnalités', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const featureList = compiled.querySelector('.feature-list');

      expect(featureList).toBeTruthy();
    });

    it('devrait afficher les tags tech', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const techTags = compiled.querySelectorAll('.tech-tag');

      expect(techTags.length).toBeGreaterThan(0);
    });
  });
});

