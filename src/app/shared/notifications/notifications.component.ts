import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      @for (notification of notifications$ | async; track notification.id) {
        <div class="notification" [class]="notification.type" (click)="dismiss(notification.id)">
          <span class="notification-icon">
            @switch (notification.type) {
              @case ('success') {
                <i class="bi bi-check-circle-fill"></i>
              }
              @case ('error') {
                <i class="bi bi-x-circle-fill"></i>
              }
              @case ('warning') {
                <i class="bi bi-exclamation-triangle-fill"></i>
              }
              @default {
                <i class="bi bi-info-circle-fill"></i>
              }
            }
          </span>
          <span class="notification-message">{{ notification.message }}</span>
          <button class="notification-close"><i class="bi bi-x"></i></button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 1001;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 350px;
    }

    .notification {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      animation: slideIn 0.3s ease;
      transition: transform 0.2s;
    }

    .notification:hover {
      transform: translateX(-5px);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification.success {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
      color: white;
    }

    .notification.error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%);
      color: white;
    }

    .notification.warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
      color: white;
    }

    .notification.info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
      color: white;
    }

    .notification-icon {
      font-size: 1.1rem;
      font-weight: bold;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }

    .notification-message {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .notification-close {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      cursor: pointer;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .notification-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  `]
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}
