import { Component, inject, OnInit } from '@angular/core';
import { ReportService } from './services/report.service';
import { AppShellComponent } from './layout/app-shell/app-shell';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly reportService = inject(ReportService);

  ngOnInit(): void {
    this.reportService.loadReport('reports/rebeccablischke-de/v1/report.json');
  }
}
