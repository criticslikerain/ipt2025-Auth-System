export class Alert {
    id: string;
    type: AlertType;
    message: string;
    autoClose: boolean;
    keepAfterRouteChange: boolean;
    fade: boolean;
  
    constructor(init?: Partial<Alert>) {
      // Enforce that `id`, `type`, and `message` are provided
      if (!init?.id || !init?.type || !init?.message) {
        throw new Error('Alert must have id, type, and message.');
      }
  
      // Assign the provided values or defaults for optional properties
      this.id = init?.id!;
      this.type = init?.type!;
      this.message = init?.message!;
      this.autoClose = init?.autoClose ?? true;  // default to true
      this.keepAfterRouteChange = init?.keepAfterRouteChange ?? false;  // default to false
      this.fade = init?.fade ?? false;  // default to false
    }
  }
  
  export enum AlertType {
    Success = 'Success',
    Error = 'Error',
    Info = 'Info',
    Warning = 'Warning'
  }
  