import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { groupBy } from '../../util/util';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { sortedOptions } from './sortedOptions';
import { ManageTickerComponent } from '../manage-ticker/manage-ticker.component';

@Component({
  selector: 'app-prediction-header',
  templateUrl: './prediction-header.component.html',
  styleUrls: ['./prediction-header.component.scss']
})
export class PredictionHeaderComponent {

  // @Input() public portfolio: any;
  @Input() public tickers: any;
  @Input() public type: any;
  @Output() public onReset = new EventEmitter<any>();
  // @Output() public onFilter = new EventEmitter<any>();
  // @Output() public onSorted = new EventEmitter<any>();

  public searchTerm: string = '';
  public sortedOptions: any;

  constructor(public dialog: MatDialog) { 
    this.sortedOptions = sortedOptions;
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if(changes.tickers && changes.tickers.currentValue) {

  //   }
  //   console.log(changes.current)
  // }

  reset(): void {
    this.onReset.emit();
  }

  search(event: any): void {
    //   this.searchTerm = event.target.value.trim();
    //   if(this.searchTerm.length>0){
    //     this.onFilter.emit(this.searchTerm);
    // }
  }

  sorted(item: any): void {
    // const selectedSortedItem = this.sortedOptions.find((option: any) => option.value === item.value.value);
    // if (selectedSortedItem) {
    //   this.onSorted.emit(selectedSortedItem);
    // } 
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ManageTickerComponent, {
      width: '1020px',
      height: 'auto',
      data: { type: this.type, tickers: this.tickers }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  public clearSearchFilter() {
    // this.searchTerm = '';
    // this.onFilter.emit(this.searchTerm);
  }

}
