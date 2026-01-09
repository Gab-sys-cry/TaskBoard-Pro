import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskEditComponent} from './task-edit.component';
import {Task} from '../../models/task.model';
import {FormsModule} from '@angular/forms';
import {beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * Tests unitaires pour TaskEditComponent
 */
describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let fixture: ComponentFixture<TaskEditComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    createdAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditComponent);
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

    it('devrait avoir un EventEmitter save', () => {
      expect(component.save).toBeDefined();
    });

    it('devrait avoir un EventEmitter cancel', () => {
      expect(component.cancel).toBeDefined();
    });
  });

  // ==================== Tests d'initialisation ====================

  describe('Initialisation avec une tâche', () => {
    beforeEach(() => {
      component.task = mockTask;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('devrait initialiser editedTitle avec le titre de la tâche', () => {
      expect(component.editedTitle).toBe('Test Task');
    });

    it('devrait initialiser editedDescription avec la description de la tâche', () => {
      expect(component.editedDescription).toBe('Test Description');
    });

    it('devrait initialiser editedPriority avec la priorité de la tâche', () => {
      expect(component.editedPriority).toBe('medium');
    });
  });

  // ==================== Tests de sauvegarde ====================

  describe('Méthode onSave()', () => {
    beforeEach(() => {
      component.task = mockTask;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('devrait émettre save avec les nouvelles valeurs', () => {
      const saveSpy = vi.spyOn(component.save, 'emit');

      component.editedTitle = 'Nouveau titre';
      component.editedDescription = 'Nouvelle description';
      component.editedPriority = 'high';

      component.onSave();

      expect(saveSpy).toHaveBeenCalledWith({
        title: 'Nouveau titre',
        description: 'Nouvelle description',
        priority: 'high'
      });
    });

    it('ne devrait pas émettre save si le titre est vide', () => {
      const saveSpy = vi.spyOn(component.save, 'emit');

      component.editedTitle = '';
      component.onSave();

      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('ne devrait pas émettre save si le titre ne contient que des espaces', () => {
      const saveSpy = vi.spyOn(component.save, 'emit');

      component.editedTitle = '   ';
      component.onSave();

      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('devrait trim le titre et la description', () => {
      const saveSpy = vi.spyOn(component.save, 'emit');

      component.editedTitle = '  Titre avec espaces  ';
      component.editedDescription = '  Description avec espaces  ';
      component.editedPriority = 'low';

      component.onSave();

      expect(saveSpy).toHaveBeenCalledWith({
        title: 'Titre avec espaces',
        description: 'Description avec espaces',
        priority: 'low'
      });
    });
  });

  // ==================== Tests des événements ====================

  describe('Événement cancel', () => {
    beforeEach(() => {
      component.task = mockTask;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('devrait émettre cancel quand on clique sur le bouton Annuler', () => {
      const cancelSpy = vi.spyOn(component.cancel, 'emit');

      const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
      cancelBtn.click();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('devrait émettre cancel quand on clique sur le bouton fermer', () => {
      const cancelSpy = vi.spyOn(component.cancel, 'emit');

      const closeBtn = fixture.nativeElement.querySelector('.close-btn');
      closeBtn.click();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('devrait émettre cancel quand on clique sur l\'overlay', () => {
      const cancelSpy = vi.spyOn(component.cancel, 'emit');

      const overlay = fixture.nativeElement.querySelector('.edit-overlay');
      overlay.click();

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  // ==================== Tests du formulaire ====================

  describe('Formulaire', () => {
    beforeEach(() => {
      component.task = mockTask;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('devrait avoir un champ titre', () => {
      const titleInput = fixture.nativeElement.querySelector('input[name="title"]');
      expect(titleInput).toBeTruthy();
    });

    it('devrait avoir un champ description', () => {
      const descInput = fixture.nativeElement.querySelector('textarea[name="description"]');
      expect(descInput).toBeTruthy();
    });

    it('devrait avoir un select priorité', () => {
      const prioritySelect = fixture.nativeElement.querySelector('select[name="priority"]');
      expect(prioritySelect).toBeTruthy();
    });

    it('devrait avoir 3 options de priorité', () => {
      const options = fixture.nativeElement.querySelectorAll('select[name="priority"] option');
      expect(options.length).toBe(3);
    });
  });
});

