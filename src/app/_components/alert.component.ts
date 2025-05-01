import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService } from '@app/_services/alert.service';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="message" class="alert" [ngClass]="message.cssClass">
            <span [innerHTML]="message.text"></span>
            <button class="close" (click)="clear()">&times;</button>
        </div>
    `,
    styles: [`
        .alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: 4px;
            position: relative;
        }
        .alert-success {
            color: #155724;
            background-color: #d4edda;
            border-color: #c3e6cb;
        }
        .alert-error {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }
        .alert-info {
            color: #0c5460;
            background-color: #d1ecf1;
            border-color: #bee5eb;
        }
        .alert-warning {
            color: #856404;
            background-color: #fff3cd;
            border-color: #ffeeba;
        }
        .close {
            position: absolute;
            right: 0.5rem;
            top: 0.5rem;
            border: none;
            background: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.5;
        }
        .close:hover {
            opacity: 1;
        }
    `]
})
export class AlertComponent implements OnInit, OnDestroy {
    private subscription!: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.alerts
            .subscribe(message => {
                this.message = message;
                if (message && message.autoClose !== false) {
                    setTimeout(() => this.clear(), 5000);
                }
            });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    clear() {
        this.alertService.clear();
        this.message = null;
    }
}
