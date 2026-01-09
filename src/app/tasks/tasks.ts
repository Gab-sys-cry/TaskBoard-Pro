import {ChangeDetectionStrategy, Component, ComponentRef, inject, ViewChild, ViewContainerRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task.model';
import {TaskHighlightComponent} from './task-highlight/task-highlight.component';
import {TaskEditComponent} from './task-edit/task-edit.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  title = 'Gestion des Tâches';
  // ViewContainerRef pour injecter les composants dynamiques
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
  dynamicContainer!: ViewContainerRef;
  private taskService = inject(TaskService);
  // Observables pour le template
  tasks$ = this.taskService.tasks$;
  totalTasks$ = this.taskService.totalTasks$;
  completedCount$ = this.taskService.completedCount$;
  pendingCount$ = this.taskService.pendingCount$;
  progressPercentage$ = this.taskService.progressPercentage$;
  completedTasks$ = this.taskService.completedTasks$;
  pendingTasks$ = this.taskService.pendingTasks$;
  // Référence au composant dynamique actuel
  private currentComponentRef: ComponentRef<any> | null = null;

  toggleTask(id: number): void {
    this.taskService.toggleTaskCompletion(id);
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }

  addTask(title: string, description: string, priority: string): void {
    if (title.trim()) {
      this.taskService.addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority: priority as 'low' | 'medium' | 'high'
      });
    }
  }

  // Mettre en avant une tâche (composant dynamique)
  highlightTask(task: Task): void {
    this.clearDynamicComponent();

    // Créer le composant dynamiquement avec ViewContainerRef
    const componentRef = this.dynamicContainer.createComponent(TaskHighlightComponent);
    this.currentComponentRef = componentRef;

    // Passer les données au composant
    componentRef.instance.task = task;

    // S'abonner à l'événement close
    componentRef.instance.close.subscribe(() => {
      this.clearDynamicComponent();
    });
  }

  editTask(task: Task): void {
    this.clearDynamicComponent();

    // Créer le composant dynamiquement
    this.currentComponentRef = this.dynamicContainer.createComponent(TaskEditComponent);

    // Passer les données au composant
    (this.currentComponentRef.instance as TaskEditComponent).task = task;

    // S'abonner aux événements
    (this.currentComponentRef.instance as TaskEditComponent).save.subscribe((updates: Partial<Task>) => {
      this.taskService.updateTask(task.id, updates);
      this.clearDynamicComponent();
    });

    (this.currentComponentRef.instance as TaskEditComponent).cancel.subscribe(() => {
      this.clearDynamicComponent();
    });
  }

  // Nettoyer le composant dynamique
  private clearDynamicComponent(): void {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }
    if (this.dynamicContainer) {
      this.dynamicContainer.clear();
    }
  }
}

