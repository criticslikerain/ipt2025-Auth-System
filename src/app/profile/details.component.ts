import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-profile-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class DetailsComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });

        // Load user details
        const userId = this.accountService.accountValue?.id;
        if (userId) {
            this.accountService.getById(userId.toString())
                .pipe(first())
                .subscribe(account => {
                    this.form.patchValue(account);
                });
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) return;

        this.loading = true;
        const userId = this.accountService.accountValue?.id;
        if (userId) {
            this.accountService.update(userId, this.form.value)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.loading = false;
                    },
                    error: error => {
                        console.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
