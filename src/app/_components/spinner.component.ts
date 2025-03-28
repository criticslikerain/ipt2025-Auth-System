import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="spinner-container" [class.inline]="inline">
            <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
        </div>
    `,
    styles: [`
        .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }

        .spinner-container.inline {
            display: inline-flex;
            padding: 0;
        }

        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `]
})
export class SpinnerComponent {
    @Input() size = 40;
    @Input() inline = false;
}