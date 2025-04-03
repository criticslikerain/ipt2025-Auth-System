import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-logout-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="container">
            <div class="login-card">
                <div class="success-message">
                    <div class="success-icon">✓</div>
                    <div class="success-text">
                        Logout successful!
                        <div class="redirect-text">
                            Redirecting to login in {{countdown}} seconds...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background-image: url('/assets/background.webp');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 9999;
        }

        .login-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            width: 100%;
            max-width: 400px;
            border-radius: 12px;
            padding: 25px 30px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .success-message {
            text-align: center;
            padding: 20px;
        }

        .success-icon {
            color: #2ed573;
            font-size: 48px;
            margin-bottom: 10px;
        }

        .success-text {
            color: white;
            font-size: 18px;
        }

        .redirect-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-top: 10px;
        }
    `]
})
export class LogoutDialogComponent implements OnInit {
    countdown = 3;
    
    ngOnInit() {
        const timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
}
