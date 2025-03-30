import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '@app/_services';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: 'layout.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    // redirect to home if already logged in
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
  }
}
