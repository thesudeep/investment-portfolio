import { Component, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { logos }  from '../../util/logos'; 
import { MatDialog } from '@angular/material/dialog';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
@Component({
  selector: 'app-assets-cards',
  templateUrl: './assets-cards.component.html',
  styleUrls: ['./assets-cards.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AssetsCardsComponent {

  showDetail: boolean = false; 
  logoUrl: string = '';
  change: number =0;

  @Input() ticker: any;
  @Input() transaction: any;

  @ViewChild(MatPaginator) paginator: any;

  constructor(public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.logoUrl = logos.find((logo: any) => logo.ticker === this.ticker)? logos.find((logo: any) => logo.ticker === this.ticker).url : '';
    this.change = (this.transaction.stats.stats_24hour.last - this.transaction.stats.stats_24hour.open)/this.transaction.stats.stats_24hour.open * 100;
  }

   openTransactionDetails() {
    const dialogRef = this.dialog.open(TransactionDetailsComponent, {
      width: '1250px',
      height: 'auto',
      panelClass: 'transaction-details-dialog', 
      data: { logoUrl: this.logoUrl, ticker: this.ticker, transaction: this.transaction }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

