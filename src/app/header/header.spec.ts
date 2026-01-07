import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

/**
 * Tests unitaires pour HeaderComponent
 */
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir un titre', () => {
      expect(component.title).toBe('TaskBoard Pro');
    });
  });

  // ==================== Tests du rendu ====================

  describe('Rendu du template', () => {
    it('devrait afficher le logo avec le titre', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logo = compiled.querySelector('.logo h1');

      expect(logo?.textContent).toBe('TaskBoard Pro');
    });

    it('devrait avoir une navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('nav');

      expect(nav).toBeTruthy();
    });

    it('devrait avoir 3 liens de navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelectorAll('.nav-list li a');

      expect(navLinks.length).toBe(3);
    });

    it('devrait avoir un lien vers Home', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const homeLink = compiled.querySelector('a[href="/"]');

      expect(homeLink).toBeTruthy();
    });

    it('devrait avoir un lien vers Tasks', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tasksLink = compiled.querySelector('a[href="/tasks"]');

      expect(tasksLink).toBeTruthy();
    });

    it('devrait avoir un lien vers About', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const aboutLink = compiled.querySelector('a[href="/about"]');

      expect(aboutLink).toBeTruthy();
    });
  });

  // ==================== Tests des classes CSS ====================

  describe('Classes CSS', () => {
    it('devrait avoir la classe header', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('.header');

      expect(header).toBeTruthy();
    });

    it('devrait avoir la classe header-container', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.header-container');

      expect(container).toBeTruthy();
    });

    it('devrait avoir la classe nav-list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navList = compiled.querySelector('.nav-list');

      expect(navList).toBeTruthy();
    });
  });
});

