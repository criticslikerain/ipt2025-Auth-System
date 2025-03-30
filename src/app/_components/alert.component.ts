import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '@app/_services';

enum AlertType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}

interface Alert {
    type?: AlertType;
    message?: string;
    fade?: boolean;
    keepAfterRouteChange?: boolean;
    autoClose?: boolean;
}

@Component({
    selector: 'app-alert', // Changed from 'alert' to 'app-alert'
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="alert" class="alert" [ngClass]="cssClass">
            {{alert.message}}
        </div>
    `,
    styles: [`
        .alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: 4px;
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
    `]
})
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id = 'default-alert';
    @Input() fade = true;

    alerts: Alert[] = [];
    alert: Alert | null = null;
    alertSubscription: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertSubscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                if (!alert.message) {
                    this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
                    this.alerts.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }

                this.alerts.push(alert);
                this.alert = alert;

                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
            });
    }

    ngOnDestroy() {
        if (this.alertSubscription) {
            this.alertSubscription.unsubscribe();
        }
    }

    removeAlert(alert: Alert) {
        if (!this.alerts.includes(alert)) return;
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert): string {
        if (!alert) return '';

        const classes = ['alert'];
        
        if (alert.type) {
            classes.push(`alert-${alert.type}`);
        }

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}
