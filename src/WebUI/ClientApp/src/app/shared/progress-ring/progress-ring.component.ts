import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-ring',
  template: `
    <div class="progress-ring-container" [style.width.px]="size" [style.height.px]="size">
      <svg 
        class="progress-ring" 
        [attr.width]="size" 
        [attr.height]="size"
        [attr.viewBox]="'0 0 ' + size + ' ' + size"
      >
        <!-- Background circle -->
        <circle
          class="progress-ring-background"
          [attr.cx]="size / 2"
          [attr.cy]="size / 2"
          [attr.r]="radius"
          [attr.stroke]="backgroundColor"
          [attr.stroke-width]="strokeWidth"
          fill="transparent"
        />
        <!-- Progress circle -->
        <circle
          class="progress-ring-progress"
          [attr.cx]="size / 2"
          [attr.cy]="size / 2"
          [attr.r]="radius"
          [attr.stroke]="color"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-dasharray]="circumference + ' ' + circumference"
          [attr.stroke-dashoffset]="strokeDashoffset"
          [attr.stroke-linecap]="strokeLinecap"
          fill="transparent"
          class="progress-circle"
        />
      </svg>
    </div>
  `,
  styles: [`
    .progress-ring-container {
      display: inline-block;
      position: relative;
    }

    .progress-ring {
      transform: rotate(-90deg);
      overflow: visible;
    }

    .progress-ring-background {
      opacity: 0.1;
    }

    .progress-circle {
      transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      animation: progress-animation 1s ease-out;
    }

    @keyframes progress-animation {
      from {
        stroke-dashoffset: var(--circumference);
      }
      to {
        stroke-dashoffset: var(--final-offset);
      }
    }

    .progress-ring-container::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - 12px);
      height: calc(100% - 12px);
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      z-index: -1;
    }
  `]
})
export class ProgressRingComponent implements OnInit {
  @Input() percentage: number = 0;
  @Input() size: number = 80;
  @Input() strokeWidth: number = 4;
  @Input() color: string = '#4ECDC4';
  @Input() backgroundColor: string = '#E5E7EB';
  @Input() strokeLinecap: 'round' | 'butt' | 'square' = 'round';
  @Input() animationDuration: number = 600;

  radius: number = 0;
  circumference: number = 0;
  strokeDashoffset: number = 0;

  ngOnInit(): void {
    this.radius = (this.size - this.strokeWidth) / 2;
    this.circumference = this.radius * 2 * Math.PI;
    this.setProgress(this.percentage);
  }

  ngOnChanges(): void {
    if (this.radius > 0) {
      this.setProgress(this.percentage);
    }
  }

  private setProgress(percentage: number): void {
    const progress = Math.min(Math.max(percentage, 0), 100);
    this.strokeDashoffset = this.circumference - (progress / 100) * this.circumference;
  }
}