import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '@app/_services';
import { Alert, AlertType } from '@app/_models';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
    alerts: Alert[] = [];
    subscription!: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.onAlert()
            .subscribe(alert => {
                this.alerts.push(alert);
            });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    removeAlert(alert: Alert) {
        if (!this.alerts.includes(alert)) return;
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClasses(alert: Alert) {
        if (!alert) return '';

        const classes = ['alert', 'alert-dismissible'];
                
        const alertTypeClass = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning'
        };

        if (alert.type !== undefined) {
            classes.push(alertTypeClass[alert.type]);
        }

        return classes.join(' ');
    }
}
