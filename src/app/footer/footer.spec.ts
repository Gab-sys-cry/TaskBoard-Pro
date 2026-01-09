import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FooterComponent} from './footer';

/**
 * Tests unitaires pour FooterComponent
 */
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ==================== Tests de création ====================

  describe('Création du composant', () => {
    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir l\'année courante', () => {
      const currentYear = new Date().getFullYear();
      expect(component.currentYear).toBe(currentYear);
    });
  });

  // ==================== Tests du rendu ====================

  describe('Rendu du template', () => {
    it('devrait afficher le copyright', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('p');

      expect(copyright?.textContent).toContain('©');
    });

    it('devrait afficher l\'année courante', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const currentYear = new Date().getFullYear();

      expect(compiled.textContent).toContain(currentYear.toString());
    });

    it('devrait afficher le nom de l\'app', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent).toContain('TaskBoard Pro');
    });
  });

  // ==================== Tests des classes CSS ====================

  describe('Classes CSS', () => {
    it('devrait avoir la classe footer', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('.footer');

      expect(footer).toBeTruthy();
    });

    it('devrait avoir la classe footer-container', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.footer-container');

      expect(container).toBeTruthy();
    });
  });
});

