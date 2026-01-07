import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
@Component({
  selector: 'app-task-highlight',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="highlight-overlay" (click)="close.emit()">
      <div class="highlight-card" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close.emit()"><i class="bi bi-x-lg"></i></button>
        <div class="highlight-header">
          <span class="highlight-icon"><i class="bi bi-star-fill"></i></span>
          <h2>Tâche mise en avant</h2>
        </div>
        <div class="highlight-content">
          <h3>{{ task?.title }}</h3>
          <p>{{ task?.description || 'Aucune description' }}</p>
          <div class="task-meta">
            <span class="priority-badge" [class]="task?.priority">
              <i class="bi bi-flag-fill"></i> {{ task?.priority }}
            </span>
            <span class="status-badge" [class.completed]="task?.completed">
              <i class="bi" [class.bi-check-circle-fill]="task?.completed" [class.bi-clock]="!task?.completed"></i>
              {{ task?.completed ? 'Terminée' : 'En cours' }}
            </span>
          </div>
          <p class="task-date"><i class="bi bi-calendar3"></i> Créée le {{ task?.createdAt | date:'dd/MM/yyyy' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .highlight-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .highlight-card {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      max-width: 450px;
      width: 90%;
      position: relative;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.6);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
    .highlight-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .highlight-icon { font-size: 1.8rem; }
    .highlight-header h2 {
      margin: 0;
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
    }
    .highlight-content { text-align: center; }
    .highlight-content h3 {
      font-size: 1.5rem;
      margin: 0 0 0.75rem;
      color: white;
    }
    .highlight-content p {
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 1.25rem;
      line-height: 1.6;
    }
    .task-meta {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .priority-badge {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
    }
    .priority-badge.high { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .priority-badge.medium { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .priority-badge.low { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-badge {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }
    .status-badge.completed {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }
    .task-date {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8rem;
      margin: 0;
    }
  `]
})
export class TaskHighlightComponent {
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
}
