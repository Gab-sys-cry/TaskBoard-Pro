import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskHighlightComponent} from './task-highlight.component';
import {Task} from '../../models/task.model';
import {beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * Tests unitaires pour TaskHighlightComponent
 */
describe('TaskHighlightComponent', () => {
  let component: TaskHighlightComponent;
  let fixture: ComponentFixture<TaskHighlightComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    priority: 'high',
    createdAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskHighlightComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskHighlightComponent);
    component = fixture.componentInstance;
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir task à null par défaut', () => {
      expect(component.task).toBeNull();
    });

    it('devrait avoir un EventEmitter close', () => {
      expect(component.close).toBeDefined();
    });
  });

  // ==================== Tests avec une tâche ====================

  describe('Avec une tâche', () => {
    beforeEach(() => {
      component.task = mockTask;
      fixture.detectChanges();
    });

    it('devrait afficher le titre de la tâche', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test Task');
    });

    it('devrait afficher la description de la tâche', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test Description');
    });

    it('devrait afficher la priorité', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const priorityBadge = compiled.querySelector('.priority-badge');
      expect(priorityBadge?.textContent).toContain('high');
    });
  });

  // ==================== Tests des événements ====================

  describe('Événements', () => {
    beforeEach(() => {
      component.task = mockTask;
      fixture.detectChanges();
    });

    it('devrait émettre close quand on clique sur le bouton fermer', () => {
      const closeSpy = vi.spyOn(component.close, 'emit');

      const closeBtn = fixture.nativeElement.querySelector('.close-btn');
      closeBtn.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('devrait émettre close quand on clique sur l\'overlay', () => {
      const closeSpy = vi.spyOn(component.close, 'emit');

      const overlay = fixture.nativeElement.querySelector('.highlight-overlay');
      overlay.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('ne devrait pas émettre close quand on clique sur la card', () => {
      const closeSpy = vi.spyOn(component.close, 'emit');

      const card = fixture.nativeElement.querySelector('.highlight-card');
      card.click();

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  // ==================== Tests des classes CSS ====================

  describe('Classes CSS', () => {
    beforeEach(() => {
      component.task = mockTask;
      fixture.detectChanges();
    });

    it('devrait avoir la classe highlight-overlay', () => {
      const overlay = fixture.nativeElement.querySelector('.highlight-overlay');
      expect(overlay).toBeTruthy();
    });

    it('devrait avoir la classe highlight-card', () => {
      const card = fixture.nativeElement.querySelector('.highlight-card');
      expect(card).toBeTruthy();
    });

    it('devrait avoir la bonne classe de priorité', () => {
      const priorityBadge = fixture.nativeElement.querySelector('.priority-badge');
      expect(priorityBadge.classList.contains('high')).toBe(true);
    });
  });
});

