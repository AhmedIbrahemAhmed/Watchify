import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../Core/Services/payment.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class SubscriptionComponent {
  loading = false;
  error: string | null = null;

  constructor(private paymentService: PaymentService) {}

  /**
   * Handle subscription button click
   */
  handleSubscribe(plan: 'month' | 'year') {
    this.loading = true;
    this.error = null;

    this.paymentService.createCheckout(plan).subscribe({
      next: (response) => {
        // Redirect to Stripe checkout
        if (response.url) {
          window.location.href = response.url;
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to create checkout. Please try again.';
        console.error('Checkout error:', error);
      },
    });
  }
}
