import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../app-header/app-header';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, AppHeaderComponent, AppSidebarComponent],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShellComponent {}
