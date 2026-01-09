import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header';
import {FooterComponent} from './footer/footer';
import {NotificationsComponent} from './shared/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'TaskBoard Pro';
}
