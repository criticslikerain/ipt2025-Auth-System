import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="container">
            <h1>Admin Settings</h1>
            <!-- Add your settings form here -->
        </div>
    `
})
export class SettingsComponent {
    constructor() {}
}
