import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements AfterViewInit {
  displayedColumns: string[] = ['date', 'type', 'unitPrice', 'fees', 'quantity', 'remaining', 'price', 'realizedGainLoss', 'unrealizedGainLoss', 'currentValue'];
  dataSource: MatTableDataSource<any>;

  // transaction: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _httpClient: HttpClient) {}

  ngOnInit() {

    // this.transaction = this.data.transaction; 
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.data.transaction);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      }, 0);
 

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    
  }
}
