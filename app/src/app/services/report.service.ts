import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UxReport } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  readonly report = signal<UxReport | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  loadReport(path: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    const url = new URL(path, this.document.baseURI).href;
    this.http.get<UxReport>(url).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message ?? 'Failed to load report');
        this.isLoading.set(false);
      },
    });
  }
}
