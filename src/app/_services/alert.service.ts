import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert, AlertType } from '@app/_models';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  // Enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  // Convenience methods
  success(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  error(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  info(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  warn(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
  }

  // Core alert method
  private alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
    this.subject.next(alert);
  }

  // Clear alert
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}
