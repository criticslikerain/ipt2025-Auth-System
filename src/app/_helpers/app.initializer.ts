import { AccountService } from '@app/_services';
import { finalize } from 'rxjs/operators';

export function appInitializer(accountService: AccountService) {
  return () => new Promise<void>((resolve, reject) => {
    accountService.refreshToken()
      .pipe(finalize(() => resolve())) 
      .subscribe(
        () => {},
        (error) => reject(error) 
      );
  });
}
