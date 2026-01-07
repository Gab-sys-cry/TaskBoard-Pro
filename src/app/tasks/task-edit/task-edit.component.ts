import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-overlay" (click)="cancel.emit()">
      <div class="edit-card" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="cancel.emit()"><i class="bi bi-x-lg"></i></button>
        <div class="edit-header">
          <span class="edit-icon"><i class="bi bi-pencil-square"></i></span>
          <h2>Modifier la tâche</h2>
        </div>
        <form class="edit-form" (ngSubmit)="onSave()">
          <div class="form-group">
            <label for="title"><i class="bi bi-type"></i> Titre</label>
            <input id="title" type="text" [(ngModel)]="editedTitle" name="title" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="description"><i class="bi bi-text-paragraph"></i> Description</label>
            <textarea id="description" [(ngModel)]="editedDescription" name="description" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="priority"><i class="bi bi-flag"></i> Priorité</label>
            <select id="priority" [(ngModel)]="editedPriority" name="priority" class="form-input">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="cancel.emit()"><i class="bi bi-x-circle"></i> Annuler</button>
            <button type="submit" class="btn-save"><i class="bi bi-check-circle"></i> Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-overlay {
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
    .edit-card {
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
    .edit-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .edit-icon { font-size: 1.5rem; }
    .edit-header h2 {
      margin: 0;
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      font-size: 1rem;
      color: white;
      box-sizing: border-box;
      transition: all 0.3s;
    }
    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    .form-input:focus {
      outline: none;
      border-color: #6366f1;
      background: rgba(255, 255, 255, 0.08);
    }
    textarea.form-input {
      resize: vertical;
      min-height: 80px;
    }
    select.form-input {
      cursor: pointer;
    }
    select.form-input option {
      background: #1a1a2e;
      color: white;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .btn-cancel, .btn-save {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-cancel {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.7);
    }
    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    .btn-save {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border: none;
      color: white;
    }
    .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }
  `]
})
export class TaskEditComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();
  editedTitle = '';
  editedDescription = '';
  editedPriority: 'low' | 'medium' | 'high' = 'medium';
  ngOnInit(): void {
    if (this.task) {
      this.editedTitle = this.task.title;
      this.editedDescription = this.task.description;
      this.editedPriority = this.task.priority;
    }
  }
  onSave(): void {
    if (this.editedTitle.trim()) {
      this.save.emit({
        title: this.editedTitle.trim(),
        description: this.editedDescription.trim(),
        priority: this.editedPriority
      });
    }
  }
}
