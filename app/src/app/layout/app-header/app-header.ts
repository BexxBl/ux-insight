import { Component, inject } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeaderComponent {
  protected readonly reportService = inject(ReportService);
}
