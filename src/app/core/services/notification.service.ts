import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  private idCounter = 0;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const notification: Notification = {
      id: ++this.idCounter,
      message,
      type,
      timestamp: new Date()
    };
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...current, notification]);
    setTimeout(() => {
      this.dismiss(notification.id);
    }, 3000);
  }

  dismiss(id: number): void {
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }
}
