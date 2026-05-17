import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Create a Stripe checkout session
   * @param plan - 'month' or 'year'
   */
  createCheckout(plan: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/create-checkout-session`, { plan });
  }

  /**
   * Activate subscription for the current user
   * @param plan - 'month' or 'year'
   */
  activateSubscription(plan: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activate-subscription`, { plan, userId });
  }

  cancelSubscription(userId: string): Observable<{ success: boolean; user: object }> {
    return this.http.post<{ success: boolean; user: object }>(
      `${this.apiUrl}/cancel-subscription`,
      { userId },
    );
  }
}
