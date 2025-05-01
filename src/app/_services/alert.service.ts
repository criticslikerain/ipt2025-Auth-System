import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface AlertOptions {
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();

    get alerts(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, options?: AlertOptions) {
        this.showAlert('success', message, options);
    }

    error(message: string, options?: AlertOptions) {
        this.showAlert('error', message, options);
    }

    info(message: string, options?: AlertOptions) {
        this.showAlert('info', message, options);
    }

    warn(message: string, options?: AlertOptions) {
        this.showAlert('warning', message, options);
    }

    private showAlert(type: string, message: string, options?: AlertOptions) {
        this.subject.next({
            type: type,
            text: message,
            cssClass: `alert-${type}`,
            ...options
        });
    }

    clear() {
        this.subject.next(null);
    }
}
