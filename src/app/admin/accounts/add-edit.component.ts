import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({
    selector: 'app-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class AddEditComponent implements OnInit {
    form!: UntypedFormGroup;
    id?: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    roles = [
        { value: 'User', label: 'User' },
        { value: 'Admin', label: 'Admin' }
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        const formGroup = {
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            status: ['Active', Validators.required],
            password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            confirmPassword: ['']
        };

        this.form = this.formBuilder.group(formGroup, {
            validator: MustMatch('password', 'confirmPassword')
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id!)
                .pipe(first())
                .subscribe(account => {
                    // Set the status explicitly
                    account.status = account.status === 'Inactive' ? 'Inactive' : 'Active';
                    this.form.patchValue(account);
                });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createAccount();
        } else {
            this.updateAccount();
        }
    }

    private createAccount() {
        const accountData = {
            ...this.form.value,
            status: this.form.get('status')?.value === 'Inactive' ? 'Inactive' : 'Active'
        };

        this.accountService.create(accountData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Account created successfully', { 
                        keepAfterRouteChange: true,
                        autoClose: true
                    });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: (error: string) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateAccount() {
        // Create a copy of the form value
        const accountData = {
            ...this.form.value,
            status: this.form.get('status')?.value === 'Inactive' ? 'Inactive' : 'Active'
        };
        
        // Remove password fields if empty to prevent overwriting existing password
        if (!accountData.password) {
            delete accountData.password;
            delete accountData.confirmPassword;
        }

        this.accountService.update(this.id!, accountData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Account updated successfully', { 
                        keepAfterRouteChange: true,
                        autoClose: true
                    });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    onCancel() {
        if (this.isAddMode) {
            this.router.navigate(['../'], { relativeTo: this.route });
        } else {
            this.router.navigate(['../../'], { relativeTo: this.route });
        }
    }
}
