import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { Account } from '@app/_models';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class UpdateComponent implements OnInit {
    private _account: Account | null = null;
    form!: FormGroup;
    loading = false;
    submitted = false;
    deleting = false;

    get account() {
        return this._account || this.accountService.accountValue;
    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this._account = this.accountService.accountValue;
        
        if (!this._account) {
            this.alertService.error('No account found');
            this.router.navigate(['/profile/details']);
            return;
        }

        this.form = this.formBuilder.group({
            title: [this.account?.title, Validators.required],
            firstName: [this.account?.firstName, Validators.required],
            lastName: [this.account?.lastName, Validators.required],
            email: [this.account?.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        const formValue = {...this.form.value};
        if (!formValue.password) {
            delete formValue.password;
            delete formValue.confirmPassword;
        }

        this.accountService.update(this.account!.id!, formValue)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../details'], { relativeTo: this.route });
                },
                error: (error: string) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    onDelete() {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            this.deleting = true;
            this.accountService.delete(this.account!.id!)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Account deleted successfully');
                    },
                    error: (error: string) => {
                        this.alertService.error(error);
                        this.deleting = false;
                    }
                });
        }
    }
}
