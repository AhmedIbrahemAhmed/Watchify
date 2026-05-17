import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Authentication } from '../../Core/Services/authentication';
import { PaymentService } from '../../Core/Services/payment.service';
import { IUserSignUp } from '../../Core/Interfaces/IAuthentication';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private auth = inject(Authentication);
  private payment = inject(PaymentService);
  private router = inject(Router);

  user = signal<IUserSignUp | null>(null);
  loading = signal(true);
  cancelling = signal(false);
  message = signal<string | null>(null);

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const userId = localStorage.getItem('Id');
    if (!userId) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.loading.set(true);
    this.auth.getUserById(userId).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Could not load profile.');
      },
    });
  }

  hasActiveSubscription(): boolean {
    const u = this.user();
    if (!u?.IsSubscribe || !u.SubscriptionEndDate) {
      return false;
    }
    return new Date(u.SubscriptionEndDate) > new Date();
  }

  cancelSubscription() {
    const userId = localStorage.getItem('Id');
    if (!userId) {
      return;
    }

    this.cancelling.set(true);
    this.message.set(null);

    this.payment.cancelSubscription(userId).subscribe({
      next: (res) => {
        this.user.set(res.user as IUserSignUp);
        this.cancelling.set(false);
        this.message.set('Subscription cancelled successfully.');
      },
      error: () => {
        this.cancelling.set(false);
        this.message.set('Failed to cancel subscription. Please try again.');
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }
}
