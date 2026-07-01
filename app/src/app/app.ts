import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReportService } from './services/report.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly reportService = inject(ReportService);

  ngOnInit(): void {
    this.reportService.loadReport('/reports/rebeccablischke-de/v1/report.json');
  }
}
