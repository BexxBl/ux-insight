import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.html',
  styleUrl: './score-card.scss',
})
export class ScoreCardComponent {
  readonly label = input.required<string>();
  readonly score = input.required<number>();
  readonly scaleMax = input.required<number>();
  readonly band = input<string | undefined>(undefined);
  readonly size = input<'default' | 'large'>('default');

  readonly percentage = computed(() =>
    Math.round((this.score() / this.scaleMax()) * 100),
  );

  readonly level = computed((): 'high' | 'medium' | 'low' => {
    const pct = this.percentage();
    if (pct >= 75) return 'high';
    if (pct >= 50) return 'medium';
    return 'low';
  });
}
