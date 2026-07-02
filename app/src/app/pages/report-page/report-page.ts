import { Component, inject } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { ScoreCardComponent } from '../../shared/score-card/score-card';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.html',
  styleUrl: './report-page.scss',
  imports: [ScoreCardComponent],
})
export class ReportPageComponent {
  private readonly reportService = inject(ReportService);

  readonly report = this.reportService.report;
  readonly isLoading = this.reportService.isLoading;
  readonly error = this.reportService.error;
}
