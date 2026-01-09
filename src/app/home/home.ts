import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  title = 'Bienvenue sur TaskBoard Pro';

  // Injection du service
  private taskService = inject(TaskService);

  // Observables exposés pour le template (utilisés avec async pipe)
  totalTasks$ = this.taskService.totalTasks$;
  completedCount$ = this.taskService.completedCount$;
  pendingCount$ = this.taskService.pendingCount$;
  progressPercentage$ = this.taskService.progressPercentage$;
}

