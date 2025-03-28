import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="message" class="error-container">
            <div class="error-icon">⚠️</div>
            <div class="error-message">{{ message }}</div>
            <button class="error-close" (click)="message = ''">×</button>
        </div>
    `,
    styles: [`
        .error-container {
            display: flex;
            align-items: center;
            padding: 1rem;
            margin: 1rem 0;
            background-color: #fff5f5;
            border: 1px solid #feb2b2;
            border-radius: 4px;
            color: #c53030;
        }

        .error-icon {
            margin-right: 0.5rem;
            font-size: 1.2em;
        }

        .error-message {
            flex-grow: 1;
        }

        .error-close {
            background: none;
            border: none;
            color: #c53030;
            cursor: pointer;
            font-size: 1.5em;
            padding: 0 0.5rem;
        }

        .error-close:hover {
            opacity: 0.7;
        }
    `]
})
export class ErrorComponent {
    @Input() message = '';
}