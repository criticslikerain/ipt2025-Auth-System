import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => new Promise{resolve => {
        // attemp to refresh token on app start up to auto authenticate
        accountService.refreshToken()
        .subscribe()
        .add(resolve);

    }};
}