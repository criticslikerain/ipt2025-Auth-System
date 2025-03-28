import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="settings-container">
            <h2>Admin Settings</h2>
            
            <div class="settings-section">
                <h3>Security Settings</h3>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" [(ngModel)]="settings.twoFactorAuth">
                        Enable Two-Factor Authentication
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" [(ngModel)]="settings.strongPasswords">
                        Require Strong Passwords
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <h3>Email Settings</h3>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" [(ngModel)]="settings.emailNotifications">
                        Enable Email Notifications
                    </label>
                </div>
                <div class="setting-item">
                    <label>From Email Address:</label>
                    <input 
                        type="email" 
                        [(ngModel)]="settings.fromEmail"
                        placeholder="noreply@example.com"
                    >
                </div>
            </div>

            <div class="settings-section">
                <h3>System Settings</h3>
                <div class="setting-item">
                    <label>Session Timeout (minutes):</label>
                    <input 
                        type="number" 
                        [(ngModel)]="settings.sessionTimeout"
                        min="5"
                        max="120"
                    >
                </div>
            </div>

            <div class="settings-actions">
                <button class="btn-save" (click)="saveSettings()">Save Settings</button>
                <button class="btn-reset" (click)="resetSettings()">Reset to Default</button>
            </div>
        </div>
    `,
    styles: [`
        .settings-container {
            padding: 1rem;
            max-width: 800px;
        }

        .settings-section {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .settings-section h3 {
            margin-top: 0;
            margin-bottom: 1rem;
            color: #2c3e50;
        }

        .setting-item {
            margin-bottom: 1rem;
        }

        .setting-item label {
            display: block;
            margin-bottom: 0.5rem;
            color: #666;
        }

        .setting-item input[type="email"],
        .setting-item input[type="number"] {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            max-width: 300px;
        }

        .settings-actions {
            margin-top: 2rem;
        }

        .btn-save,
        .btn-reset {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 1rem;
        }

        .btn-save {
            background-color: #28a745;
            color: white;
        }

        .btn-reset {
            background-color: #6c757d;
            color: white;
        }
    `]
})
export class SettingsComponent {
    settings = {
        twoFactorAuth: false,
        strongPasswords: true,
        emailNotifications: true,
        fromEmail: 'noreply@example.com',
        sessionTimeout: 30
    };

    saveSettings() {
        // Implement save functionality
        console.log('Saving settings:', this.settings);
    }

    resetSettings() {
        this.settings = {
            twoFactorAuth: false,
            strongPasswords: true,
            emailNotifications: true,
            fromEmail: 'noreply@example.com',
            sessionTimeout: 30
        };
    }
}