import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './_components/nav.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavComponent],
    template: `
        <app-nav></app-nav>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    title = 'Auth System';

    ngOnInit() {
        console.log('App component initialized');
        console.log('Initial localStorage state:', localStorage.getItem('accounts'));
        
        // Add a listener to detect localStorage changes
        window.addEventListener('storage', (event) => {
            console.log('Storage changed:', event);
            if (event.key === 'accounts' || event.key === null) {
                console.log('Accounts storage changed:', {
                    oldValue: event.oldValue,
                    newValue: event.newValue
                });
            }
        });
    }
}
