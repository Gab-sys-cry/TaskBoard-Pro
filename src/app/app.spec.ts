import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from './core/services/notification.service';
import { TaskService } from './services/task.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Tests unitaires pour le composant racine App
 */
describe('App', () => {
  let notificationServiceMock: Partial<NotificationService>;
  let taskServiceMock: Partial<TaskService>;

  beforeEach(async () => {
    notificationServiceMock = {
      notifications$: new BehaviorSubject([]).asObservable(),
      show: () => {},
      dismiss: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {}
    };

    taskServiceMock = {
      tasks$: new BehaviorSubject([]).asObservable(),
      totalTasks$: new BehaviorSubject(0).asObservable(),
      completedCount$: new BehaviorSubject(0).asObservable(),
      pendingCount$: new BehaviorSubject(0).asObservable(),
      progressPercentage$: new BehaviorSubject(0).asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: TaskService, useValue: taskServiceMock }
      ]
    }).compileComponents();
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer l\'application', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    it('devrait avoir le titre TaskBoard Pro', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.title).toBe('TaskBoard Pro');
    });
  });

  // ==================== Tests du rendu ====================

  describe('Rendu du template', () => {
    it('devrait contenir app-header', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-header')).toBeTruthy();
    });

    it('devrait contenir app-footer', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-footer')).toBeTruthy();
    });

    it('devrait contenir app-notifications', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-notifications')).toBeTruthy();
    });

    it('devrait contenir router-outlet', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('devrait avoir la classe app-container', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.app-container')).toBeTruthy();
    });

    it('devrait avoir la classe main-content', () => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.main-content')).toBeTruthy();
    });
  });
});

