import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Alert {
    id?: string;
    type: AlertType;
    message: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
    fade?: boolean;
}

export enum AlertType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultId = 'default-alert';

    onAlert(id = this.defaultId): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    success(message: string, options?: Partial<Alert>) {
        this.alert(message, AlertType.Success, options);
    }

    error(message: string, options?: Partial<Alert>) {
        this.alert(message, AlertType.Error, options);
    }

    info(message: string, options?: Partial<Alert>) {
        this.alert(message, AlertType.Info, options);
    }

    warn(message: string, options?: Partial<Alert>) {
        this.alert(message, AlertType.Warning, options);
    }

    alert(message: string, type: AlertType, options: Partial<Alert> = {}) {
        const alert: Alert = { id: this.defaultId, type, message, ...options };
        this.subject.next(alert);
    }

    clear(id = this.defaultId) {
        this.subject.next({ id: id, type: AlertType.Info, message: '' });
    }
}
