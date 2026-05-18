import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';
import { Authentication } from '../../Core/Services/authentication';
import { IUserSignUp } from '../../Core/Interfaces/IAuthentication';

@Component({
  selector: 'app-nav-blank',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.html',
  styleUrl: './nav-blank.css',
})
export class NavBlank implements OnInit {
  private auth = inject(Authentication);
  private router = inject(Router);
  showSubscribeLink = signal(true);

  ngOnInit() {
    this.loadSubscriptionState();

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.loadSubscriptionState());
  }

  loadSubscriptionState() {
    const userId = localStorage.getItem('Id');
    if (!userId) {
      this.showSubscribeLink.set(true);
      return;
    }

    this.auth.getUserById(userId).subscribe({
      next: (user) => {
        this.showSubscribeLink.set(!this.hasActiveSubscription(user));
      },
      error: () => {
        this.showSubscribeLink.set(true);
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }

  private hasActiveSubscription(user: IUserSignUp): boolean {
    if (!user.IsSubscribe || !user.SubscriptionEndDate) {
      return false;
    }

    return new Date(user.SubscriptionEndDate) > new Date();
  }
}
