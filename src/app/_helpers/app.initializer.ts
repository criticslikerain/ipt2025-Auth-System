import { APP_INITIALIZER } from '@angular/core';
import { AccountService } from '@app/_services/account.service';

export function appInitializer(accountService: AccountService) {
    return () => new Promise((resolve, reject) => {
        accountService.refreshToken()
            .subscribe({
                next: () => {
                    resolve(true);
                },
                error: (error: Error) => {
                    reject(error);
                }
            });
    });
}

export const appInitializerProvider = {
    provide: APP_INITIALIZER,
    useFactory: appInitializer,
    deps: [AccountService],
    multi: true
}
