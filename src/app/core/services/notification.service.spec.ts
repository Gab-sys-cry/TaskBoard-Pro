import {TestBed} from '@angular/core/testing';
import {NotificationService} from './notification.service';
import {firstValueFrom} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * Tests unitaires pour NotificationService
 */
describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  // ==================== Tests de création ====================

  describe('Création du service', () => {
    it('devrait créer le service', () => {
      expect(service).toBeTruthy();
    });

    it('devrait avoir un Observable notifications$ vide au départ', async () => {
      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications).toEqual([]);
    });
  });

  // ==================== Tests de show() ====================

  describe('show()', () => {
    it('devrait ajouter une notification de type info par défaut', async () => {
      service.show('Test message');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('info');
      expect(notifications[0].message).toBe('Test message');
    });

    it('devrait ajouter une notification avec le type spécifié', async () => {
      service.show('Error message', 'error');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].type).toBe('error');
    });

    it('devrait assigner un ID unique à chaque notification', async () => {
      service.show('Message 1');
      service.show('Message 2');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].id).not.toBe(notifications[1].id);
    });

    it('devrait assigner un timestamp', async () => {
      service.show('Message avec timestamp');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].timestamp).toBeDefined();
      expect(notifications[0].timestamp instanceof Date).toBe(true);
    });
  });

  // ==================== Tests des méthodes raccourcis ====================

  describe('Méthodes raccourcis', () => {
    it('success() devrait créer une notification de type success', async () => {
      service.success('Succès!');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].type).toBe('success');
      expect(notifications[0].message).toBe('Succès!');
    });

    it('error() devrait créer une notification de type error', async () => {
      service.error('Erreur!');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].type).toBe('error');
      expect(notifications[0].message).toBe('Erreur!');
    });

    it('info() devrait créer une notification de type info', async () => {
      service.info('Information');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].type).toBe('info');
    });

    it('warning() devrait créer une notification de type warning', async () => {
      service.warning('Attention!');

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications[0].type).toBe('warning');
    });
  });

  // ==================== Tests de dismiss() ====================

  describe('dismiss()', () => {
    it('devrait supprimer une notification par son ID', async () => {
      service.show('Message 1');
      service.show('Message 2');

      let notifications = await firstValueFrom(service.notifications$);
      const idToRemove = notifications[0].id;

      service.dismiss(idToRemove);

      notifications = await firstValueFrom(service.notifications$);
      expect(notifications.length).toBe(1);
      expect(notifications.find(n => n.id === idToRemove)).toBeUndefined();
    });

    it('ne devrait rien faire si l\'ID n\'existe pas', async () => {
      service.show('Message');

      service.dismiss(99999);

      const notifications = await firstValueFrom(service.notifications$);
      expect(notifications.length).toBe(1);
    });
  });

  // ==================== Tests d'auto-suppression ====================

  describe('Auto-suppression', () => {
    it('devrait supprimer automatiquement après 3 secondes', async () => {
      vi.useFakeTimers();

      service.show('Message auto-supprimé');

      let notifications = await firstValueFrom(service.notifications$);
      expect(notifications.length).toBe(1);

      // Avancer le temps de 3 secondes
      vi.advanceTimersByTime(3000);

      notifications = await firstValueFrom(service.notifications$);
      expect(notifications.length).toBe(0);

      vi.useRealTimers();
    });
  });
});

