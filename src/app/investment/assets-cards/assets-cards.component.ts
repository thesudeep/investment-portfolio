import { AfterViewInit, Component, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { logos }  from '../../util/logos'; 
import { MatDialog } from '@angular/material/dialog';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
@Component({
  selector: 'app-assets-cards',
  templateUrl: './assets-cards.component.html',
  styleUrls: ['./assets-cards.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AssetsCardsComponent implements AfterViewInit{
  // displayedColumns: string[] = ['date', 'unitPrice', 'fees', 'quantity', 'price'];
  // dataSource = new MatTableDataSource<any>()
  showDetail: boolean = false; 
  logoUrl: string = '';

  @Input() ticker: any;
  @Input() transaction: any;
  // @Input() transactionByMonthYearTicker: any;

  @ViewChild(MatPaginator) paginator: any;

  constructor(public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.logoUrl = logos.find((logo: any) => logo.ticker === this.ticker)? logos.find((logo: any) => logo.ticker === this.ticker).url : '';

    // this.transactionByMonthYearTicker.forEach((item: any) => {
    //   this.dataSource.data.push(item);
    // });

    // console.log(this.transactionByMonthYearTicker)
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  // toggleDetails() {
  //   this.showDetail = !this.showDetail;
  // }

  openTransactionDetails() {
    const dialogRef = this.dialog.open(TransactionDetailsComponent, {
      width: '1250px',
      height: 'auto',
      panelClass: 'transaction-details-dialog', 
      data: { logoUrl: this.logoUrl, transaction: this.transaction }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

