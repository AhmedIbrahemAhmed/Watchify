import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../Core/Services/payment.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class SuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const plan = params['plan'];
      const userId = localStorage.getItem('Id');

      if (plan && userId && ['month', 'year'].includes(plan)) {
        this.paymentService.activateSubscription(plan, userId).subscribe({
          error: (err) => console.error('Subscription activation failed:', err),
        });
      }
    });
  }
}
