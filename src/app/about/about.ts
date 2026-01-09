import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  title = 'À propos de TaskBoard Pro';

  // Injection du service pour afficher les stats
  private taskService = inject(TaskService);

  // Observables pour les statistiques (utilisés avec async pipe)
  totalTasks$ = this.taskService.totalTasks$;
  completedCount$ = this.taskService.completedCount$;
  pendingCount$ = this.taskService.pendingCount$;
  progressPercentage$ = this.taskService.progressPercentage$;
}

