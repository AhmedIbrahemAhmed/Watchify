import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {

  @Input() currentPage: number = 0;

  @Input() totalPages: number = 0;

  @Input() totalPagesArray: number[] = [];

  @Output() pageChanged = new EventEmitter<number>();


  goToPage(page: number) {

    if (page !== this.currentPage && page > 0 && page <= this.totalPages) {

      this.pageChanged.emit(page);
    }

  }

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.pageChanged.emit(this.currentPage + 1);
    }

  }

  previousPage() {

    if (this.currentPage > 1) {

      this.pageChanged.emit(this.currentPage - 1);

    }

  }

}
