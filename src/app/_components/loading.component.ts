import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="loading-overlay" *ngIf="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">{{ message }}</div>
        </div>
    `,
    styles: [`
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .loading-text {
            color: white;
            margin-top: 15px;
            font-size: 1.2em;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `]
})
export class LoadingComponent {
    @Input() loading = false;
    @Input() message = 'Loading...';
}


