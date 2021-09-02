import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { groupBy } from '../../util/util';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { sortedOptions } from './sortedOptions';

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
  public sortedOptions: any;

  constructor(public dialog: MatDialog) { 
    this.sortedOptions = sortedOptions;
  }

  deleteData(): void {
    this.onDelete.emit();
  }

  search(event: any): void {
      this.searchTerm = event.target.value.trim();
      this.onFilter.emit(this.searchTerm);
  }

  sorted(item: any): void {
    const selectedSortedItem = this.sortedOptions.find((option: any) => option.value === item.value.value);
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
