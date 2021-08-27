import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { groupBy } from '../../util/util';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-portfolio-header',
  templateUrl: './portfolio-header.component.html',
  styleUrls: ['./portfolio-header.component.scss']
})
export class PortfolioHeaderComponent {

  @Input() public portfolio: any;
  @Input() public type: any;
  @Output() public onDelete = new EventEmitter<any>();
  @Output() public onFilter = new EventEmitter<any>();
  @Output() public onSorted = new EventEmitter<any>();

  public searchTerm: string = '';
  public sortedOptions = [
    {
      value: 1,
      text: 'Highest Realized Gain',
      name: 'totalRealizedGainLoss',
      orderIndex: -1
    },
    {
      value: 2,
      text: 'Highest Realized Loss',
      name: 'totalRealizedGainLoss',
      orderIndex: 1
    },
    {
      value: 3,
      text: 'Highest Unrealized Gain',
      name: 'totalUnrealizedGainLoss',
      orderIndex: -1
    },
    {
      value: 4,
      text: 'Highest Unrealized Loss',
      name: 'totalUnrealizedGainLoss',
      orderIndex: 1
    },
    {
      value: 5,
      text: 'Highest Current Gain',
      name: 'totalGainLoss',
      orderIndex: -1
    },
    {
      value: 6,
      text: 'Highest Current Loss',
      name: 'totalGainLoss',
      orderIndex: 1
    },
    {
      value: 7,
      text: 'Highest Current Value',
      name: 'totalCurrentValue',
      orderIndex: -1
    },
    {
      value: 8,
      text: 'Highest Fee',
      name: 'totalFees',
      orderIndex: -1
    },
    {
      value: 9,
      text: 'Todays Best',
      name: 'change',
      orderIndex: -1
    },
    {
      value: 10,
      text: 'Todays Worst',
      name: 'change',
      orderIndex: 1
    }
  ];

  public selectedSortedValue = 7;


  constructor(public dialog: MatDialog) { }

  deleteData(): void {
    this.onDelete.emit();
  }

  search(event: any): void {
    this.searchTerm = event.target.value;
    this.onFilter.emit(this.searchTerm);
  }

  sorted(event: any): void {
    this.selectedSortedValue = event.value;
    const selectedSortedItem = this.sortedOptions.find((item: any) => item.value === this.selectedSortedValue);
    if (selectedSortedItem) {
      this.onSorted.emit(selectedSortedItem);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '600px',
      height: 'auto',
      data: { type: this.type }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  public clearSearchFilter() {
    this.searchTerm = '';
    this.onFilter.emit(this.searchTerm);
  }

}
